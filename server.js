const express = require('express');
const multer = require('multer');
const pool = require('./config/db');
const path = require('path');
const app = express();
const fs = require('fs');
const fileType = require('file-type');

// Set up multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        try {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.mimetype)) {
                throw new Error('Unsupported file type');
            }
            cb(null, true);
        } catch (error) {
            cb(error, false);
        }
    },
});


app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    } else if (err.message === 'Unsupported file type') {
        return res.status(400).json({ error: 'File type not allowed. Please upload JPEG, PNG, or PDF files.' });
    }
    res.status(500).json({ error: 'An unexpected error occurred' });
});


// File upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { originalname, size, path: tempPath } = req.file;
        const fileBuffer = fs.readFileSync(tempPath);

        // Check the file type
        const detectedType = await fileType.fromBuffer(fileBuffer);
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
            fs.unlinkSync(tempPath); // Delete the uploaded file
            throw new Error('File content does not match the allowed types');
        }

        // Sanitize filename and store metadata
        const sanitizedFilename = path.basename(originalname);
        const uploadTimestamp = new Date();
        const query = `
            INSERT INTO file_metadata (filename, file_size, file_type, upload_timestamp)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [sanitizedFilename, size, detectedType.mime, uploadTimestamp];

        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'File uploaded and verified successfully',
            metadata: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/download/:id', async (req, res) => {
    try {
        const fileId = req.params.id;

        // Fetch file metadata from the database
        const query = 'SELECT * FROM file_metadata WHERE id = $1';
        const result = await pool.query(query, [fileId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = result.rows[0];
        const filePath = path.join(__dirname, 'uploads', file.filename);

        // Check if the file exists on the server
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        // Set headers and send the file
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        res.setHeader('Content-Type', file.file_type);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while downloading the file' });
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const fileId = req.params.id;

        // Fetch file metadata from the database
        const query = 'SELECT * FROM file_metadata WHERE id = $1';
        const result = await pool.query(query, [fileId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = result.rows[0];
        const filePath = path.join(__dirname, 'uploads', file.filename);

        // Delete the file from the server
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Remove file
        }

        // Delete metadata from the database
        const deleteQuery = 'DELETE FROM file_metadata WHERE id = $1';
        await pool.query(deleteQuery, [fileId]);

        res.status(200).json({ message: 'File and metadata deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while deleting the file' });
    }
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

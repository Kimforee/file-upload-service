# File Upload Service

This is a simple file upload service built with Node.js and Express.js. It allows users to upload files, store them, and manage metadata securely.

## Features
- Upload files (images, PDFs) up to 5MB.
- Store metadata in PostgreSQL.
- Secure file validation and MIME type checks.
- Download and delete files via API.

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/kimforee/file-upload-service.git
   cd file-upload-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the database in `config/db.js`.
4. Run the application:
   ```bash
   node server.js
   ```

## API Endpoints
1. **Upload File**: `POST /upload`
2. **Download File**: `GET /download/:id`
3. **Delete File**: `DELETE /delete/:id`

## License
This project is licensed under the MIT License.


### Step 5: Push Changes
1. Add the `README.md`:
   ```bash
   git add README.md
   git commit -m "Added README file"
   git push
   ```

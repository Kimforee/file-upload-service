# File Upload Service

This is a simple file upload service built with Node.js and Express.js. It allows users to upload files, store them, and manage metadata securely.

Results : 
Upload File: POST /upload
![image](https://github.com/user-attachments/assets/4e51bfa1-717d-4f52-9403-ffa0dac0e074)

Download File: GET /download/:id
![image](https://github.com/user-attachments/assets/b6efb52f-adf8-45b8-81c0-8689e3b4eb33)

Delete File: DELETE /delete/:id
![image](https://github.com/user-attachments/assets/58c9f7b6-bb94-411f-b111-1b96bd25bea2)




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

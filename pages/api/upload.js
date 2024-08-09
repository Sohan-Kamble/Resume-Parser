import multer from 'multer';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import docxParser from 'docx-parser';

// Setup multer storage configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const uploadMiddleware = upload.single('resume');

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle file uploads
  },
};

const handler = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('Upload middleware error:', err);
      return res.status(500).json({ error: 'File upload error' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = path.join('./public/uploads', req.file.filename);
      let text = '';

      if (req.file.mimetype === 'application/pdf') {
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        text = pdfData.text;
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const docxBuffer = fs.readFileSync(filePath);
        const docxData = await docxParser.parse(docxBuffer);
        text = docxData.text;
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }

      // Clean up: remove the uploaded file
      fs.unlinkSync(filePath);

      res.status(200).json({ text });
    } catch (error) {
      console.error('Parsing error:', error);
      res.status(500).json({ error: error.message });
    }
  });
};

export default handler;

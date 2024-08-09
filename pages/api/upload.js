// pages/api/upload.js

import multer from 'multer';
import nextConnect from 'next-connect';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import docxParser from 'docx-parser';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const handler = nextConnect()
  .use(upload.single('resume'))
  .post(async (req, res) => {
    try {
      const filePath = path.join('./public/uploads', req.file.filename);

      let text = '';

      if (req.file.mimetype === 'application/pdf') {
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        text = pdfData.text;
      }

      if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const docxData = await docxParser.parse(fs.readFileSync(filePath));
        text = docxData.text;
      }

      fs.unlinkSync(filePath);

      res.status(200).json({ text });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default handler;

// utils/parser.js

export const parseResume = (text) => {
    // Example of extracting simple information
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const phoneRegex = /\b\d{10}\b/;
  
    const email = text.match(emailRegex) ? text.match(emailRegex)[0] : 'Not found';
    const phone = text.match(phoneRegex) ? text.match(phoneRegex)[0] : 'Not found';
  
    return { email, phone };
  };
  
import { useState } from 'react';
import styles from '../styles/Home.module.css'; // Import CSS module for styling

const Home = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const parsedData = parseResume(data.text);
      setResult(parsedData);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file.');
      setResult(null); // Clear previous results
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Resume Parser</h1>
      </header>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleChange}
            className={styles.fileInput}
          />
          <button type="submit" className={styles.submitButton}>
            Upload and Parse
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        {result && (
          <div className={styles.results}>
            <h2 className={styles.resultsTitle}>Parsed Results:</h2>
            <p><strong>Email:</strong> {result.email}</p>
            <p><strong>Phone:</strong> {result.phone}</p>
            <p><strong>Resume Text:</strong></p>
            <pre className={styles.resumeText}>{result.text}</pre>
          </div>
        )}
      </main>
    </div>
  );
};

// Parsing logic for extracting email and phone from text
const parseResume = (text) => {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const phoneRegex = /(\+?\d{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,15}/g;

  const emails = text.match(emailRegex);
  const phones = text.match(phoneRegex);

  return {
    email: emails ? emails[0] : 'Not found',
    phone: phones ? phones[0] : 'Not found',
    text, // include raw text for display
  };
};

export default Home;

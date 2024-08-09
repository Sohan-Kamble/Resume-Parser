// pages/index.js

import { useState } from 'react';
import { parseResume } from '../utils/parser';

const Home = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    const parsedData = parseResume(data.text);
    setResult(parsedData);
  };

  return (
    <div>
      <h1>Resume Parser</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.docx" onChange={handleChange} />
        <button type="submit">Upload and Parse</button>
      </form>

      {result && (
        <div>
          <h2>Parsed Results:</h2>
          <p><strong>Email:</strong> {result.email}</p>
          <p><strong>Phone:</strong> {result.phone}</p>
        </div>
      )}
    </div>
  );
};

export default Home;

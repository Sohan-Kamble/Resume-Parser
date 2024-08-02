// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [resumeText, setResumeText] = useState('');
  const [parsedData, setParsedData] = useState(null);

  const parseResume = () => {
    // Example parsing function
    const sections = resumeText.split('\n\n');
    const personalInfo = sections[0].split('\n').reduce((info, line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        info[key.trim()] = value.trim();
      }
      return info;
    }, {});

    const skills = sections[1].split('\n').map(skill => skill.trim());
    const experience = sections[2].split('\n').map(exp => exp.trim());
    const education = sections[3].split('\n').map(edu => edu.trim());

    setParsedData({
      PersonalInformation: personalInfo,
      Skills: skills,
      Experience: experience,
      Education: education,
    });
  };

  return (
    <div>
      <h1>Resume Parser</h1>
      <textarea
        rows="10"
        cols="50"
        placeholder="Paste your resume text here"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
      <button onClick={parseResume}>Parse Resume</button>
      {parsedData && (
        <pre>{JSON.stringify(parsedData, null, 2)}</pre>
      )}
    </div>
  );
}

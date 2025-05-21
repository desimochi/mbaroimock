'use client';

import { useState } from 'react';

export default function ExcelUploader() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  async function handleUpload() {
    if (!file) {
      setMessage('Please select a file first!');
      return;
    }
    setMessage('Uploading...');

    try {
      const res = await fetch(`/api/bulk-upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,  // raw file stream
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Success! Imported ${data.inserted} questions.`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Upload failed: ' + err.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Upload Excel File</h2>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={e => setFile(e.target.files[0])}
        style={{ marginBottom: '1rem', display: 'block' }}
      />
      <button onClick={handleUpload} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Upload
      </button>
      <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>
    </div>
  );
}

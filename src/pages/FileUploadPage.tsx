import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

const FileUploadPage: React.FC = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pdfFileError, setPdfFileError] = useState<string>('');

  const [viewPdf, setViewPdf] = useState<string | null>(null);

  const fileType = ['application/pdf'];

  const handlePdfFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    let selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (event: ProgressEvent<FileReader>) => {
          if (event.target) {
            setPdfFile(event.target.result as string);
            setPdfFileError('');
          }
        };
      } else {
        setPdfFile(null);
        setPdfFileError('Please select a valid pdf file');
      }
    } else {
      console.log('Select your file');
    }
  };

  const handlePdfFileSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pdfFile !== null) {
      setViewPdf(pdfFile);
    } else {
      setViewPdf(null);
    }
  };

  return (
    <Container maxWidth="md">
      <br />
      <form onSubmit={handlePdfFileSubmit}>
        <TextField
          type="file"
          variant="outlined"
          required
          fullWidth
          onChange={handlePdfFileChange}
        />
        {pdfFileError && <Alert severity="error">{pdfFileError}</Alert>}
        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Upload Document
        </Button>
      </form>
      <br />
      <div className="pdf-container">
        {viewPdf && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div className="viewer-wrapper">
              <Viewer fileUrl={viewPdf} plugins={[defaultLayoutPluginInstance]} />
            </div>
          </Worker>
        )}
        {!viewPdf && <>No pdf file selected</>}
      </div>
    </Container>
  );
};

export default FileUploadPage;

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { pageNavigationPlugin, RenderCurrentPageLabelProps } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

const FileUploadPage: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pdfFileError, setPdfFileError] = useState<string>('');
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const { CurrentPageLabel } = pageNavigationPluginInstance;


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

      <div className="pdf-container"
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                // height: '100%',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '8px',
                }}
            >
                <CurrentPageLabel>
                    {(props: RenderCurrentPageLabelProps) => (
                        <span>{`${props.currentPage + 1} of ${props.numberOfPages}`}</span>
                    )}
                </CurrentPageLabel>
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
              {viewPdf && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div className="viewer-wrapper">
                <Viewer fileUrl={viewPdf} plugins={[pageNavigationPluginInstance]} />
                </div>
              </Worker>
            )}
        {!viewPdf && <>No pdf file selected</>}
            </div>
      </div>
    </Container>
  );
};

export default FileUploadPage;


// import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
// import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
// import { pageNavigationPlugin, RenderCurrentPageLabelProps } from '@react-pdf-viewer/page-navigation';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// import Button from '@mui/material/Button';
// import Container from '@mui/material/Container';
// import TextField from '@mui/material/TextField';
// import Alert from '@mui/material/Alert';

// const FileUploadPage: React.FC = () => {
//   const [pdfFile, setPdfFile] = useState<string | null>(null);
//   const [pdfFileError, setPdfFileError] = useState<string>('');
//   const pageNavigationPluginInstance = pageNavigationPlugin();
//   const { CurrentPageLabel } = pageNavigationPluginInstance;
//   const [viewPdf, setViewPdf] = useState<string | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
//   const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });

//   const fileType = ['application/pdf'];

//   const handlePdfFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files && e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile && fileType.includes(selectedFile.type)) {
//         let reader = new FileReader();
//         reader.readAsDataURL(selectedFile);
//         reader.onloadend = (event: ProgressEvent<FileReader>) => {
//           if (event.target) {
//             setPdfFile(event.target.result as string);
//             setPdfFileError('');
//           }
//         };
//       } else {
//         setPdfFile(null);
//         setPdfFileError('Please select a valid pdf file');
//       }
//     } else {
//       console.log('Select your file');
//     }
//   };

//   const handlePdfFileSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     if (pdfFile !== null) {
//       setViewPdf(pdfFile);
//     } else {
//       setViewPdf(null);
//     }
//   };

//   useEffect(() => {
//     if (canvasRef.current) {
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');
//       if (context) {
//         context.clearRect(0, 0, canvas.width, canvas.height);

//         if (isDrawing) {
//           context.beginPath();
//           context.rect(startCoords.x, startCoords.y, endCoords.x - startCoords.x, endCoords.y - startCoords.y);
//           context.strokeStyle = 'red';
//           context.lineWidth = 2;
//           context.stroke();
//         }
//       }
//     }
//   }, [isDrawing, startCoords, endCoords]);

//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     setIsDrawing(true);
//     setStartCoords({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (isDrawing) {
//       setEndCoords({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDrawing(false);
//   };

//   return (
//     <Container maxWidth="md">
//       <br />
//       <form onSubmit={handlePdfFileSubmit}>
//         <TextField
//           type="file"
//           variant="outlined"
//           required
//           fullWidth
//           onChange={handlePdfFileChange}
//         />
//         {pdfFileError && <Alert severity="error">{pdfFileError}</Alert>}
//         <br />
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Upload Document
//         </Button>
//       </form>
//       <br />

//       <div className="pdf-container">
//         <canvas
//           ref={canvasRef}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           style={{
//             border: '1px solid rgba(0, 0, 0, 0.3)',
//           }}
//         />
//         {viewPdf && (
//           <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
//             <div className="viewer-wrapper">
//               <Viewer
//                 fileUrl={viewPdf}
//                 plugins={[pageNavigationPluginInstance]}
//                 defaultScale={SpecialZoomLevel.PageFit}
//               />
//             </div>
//           </Worker>
//         )}
//         {!viewPdf && <>No pdf file selected</>}
//       </div>

//       <div
//         style={{
//           alignItems: 'center',
//           backgroundColor: '#eeeeee',
//           borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
//           display: 'flex',
//           justifyContent: 'center',
//           padding: '8px',
//         }}
//       >
//         <CurrentPageLabel>
//           {(props: RenderCurrentPageLabelProps) => (
//             <span>{`${props.currentPage + 1} of ${props.numberOfPages}`}</span>
//           )}
//         </CurrentPageLabel>
//       </div>
//     </Container>
//   );
// };

// export default FileUploadPage;

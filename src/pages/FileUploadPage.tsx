import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfUploaderProps {}

const PdfUploader: React.FC<PdfUploaderProps> = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfNumPages, setPdfNumPages] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfWithImage, setPdfWithImage] = useState<Uint8Array | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  const memoizedFile = useMemo(() => ({ data: pdfWithImage }), [pdfWithImage]);

  const onDrop = async (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setPdfFile(pdfFile);
      setPdfNumPages(null);
      setPdfWithImage(null); // Reset modified PDF when a new PDF is uploaded
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      setMousePosition(null); // Reset mouse position when a new image is uploaded
    }
  };

  const handleDocumentMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageFile && documentRef.current) {
      const rect = documentRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  const addImageToPdf = async () => {
    if (pdfFile && imageFile && mousePosition) {
      try {
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Get the rendered pages
        const renderedPages = document.querySelectorAll('.react-pdf__Page');

        // Find the page based on the mouse position
        const pageIndex = Array.from(renderedPages).findIndex((page) => {
          const rect = page.getBoundingClientRect();
          return (
            mousePosition.x >= rect.left &&
            mousePosition.x <= rect.right &&
            mousePosition.y >= rect.top &&
            mousePosition.y <= rect.bottom
          );
        });

        // If a valid page index is found, add the image to that page
        if (pageIndex !== -1) {
          const imageBytes = await imageFile.arrayBuffer();
          const image = await pdfDoc.embedJpg(imageBytes);

          const selectedPage = pdfDoc.getPage(pageIndex); // Note: Page indexes are 0-based
          const { width, height } = await selectedPage.getSize();
          selectedPage.drawImage(image, {
            x: mousePosition.x,
            y: mousePosition.y - 0.5 * image.height, // Adjust the y-coordinate
            width: image.width,
            height: image.height,
          });

          const modifiedPdfBytes = await pdfDoc.save();
          setPdfWithImage(modifiedPdfBytes); // Update modified PDF bytes
          setPdfFile(new File([modifiedPdfBytes], pdfFile.name)); // Update PDF file with modified bytes

          // Refresh PDF preview by resetting the number of pages
          setPdfNumPages(null);
          setMousePosition(null); // Reset mouse position after adding the image
        } else {
          alert('Please select a valid position on the PDF.');
        }
      } catch (error) {
        console.error('Error adding image to PDF:', error);
      }
    } else {
      alert('Please upload both a PDF file, an image file, and select a position on the PDF.');
    }
  };

  useEffect(() => {
    if (documentRef.current && documentRef.current.firstChild) {
      const firstPage = documentRef.current.firstChild as HTMLElement;
      setPreviewWidth(firstPage.offsetWidth);
    }
  }, [pdfNumPages]);

  const dropzoneStyles: React.CSSProperties = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    margin: '20px 0',
  };

  const pdfPreviewContainerStyles: React.CSSProperties = {
    border: '1px solid #cccccc',
    margin: '10px 0',
    width: previewWidth ? `${previewWidth}px` : '100%', // Set the width dynamically
  };

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the PDF file here...</p> : <p>Drag 'n' drop a PDF file here, or click to select one</p>}
      </div>

      {pdfFile && (
        <div
          className="pdf-preview-container"
          style={pdfPreviewContainerStyles}
          onMouseDown={handleDocumentMouseDown}
          ref={documentRef}
        >
          <div style={{ height: '400px', overflowY: 'auto' }}>
            <Document
              file={pdfFile}
              onLoadSuccess={({ numPages }) => {
                console.log('Original PDF loaded successfully. Number of pages:', numPages);
                setPdfNumPages(numPages);
              }}
            >
              {Array.from(new Array(pdfNumPages || 0), (el, index) => (
                <React.Fragment key={`page_${index + 1}`}>
                  <div style={{ border: '1px solid #cccccc', marginBottom: '10px' }}>
                    <Page pageNumber={index + 1} />
                  </div>
                </React.Fragment>
              ))}
            </Document>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="imageUpload">Upload Image:</label>
        <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
      </div>

      {mousePosition && (
        <p>
          Image will be inserted at: ({mousePosition.x}, {mousePosition.y})
        </p>
      )}

      <button onClick={addImageToPdf} disabled={!pdfFile || !imageFile || !mousePosition}>
        Add Image to PDF
      </button>
    </div>
  );
};

export default PdfUploader;

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button, Typography } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfUploaderProps {}

const PdfUploader: React.FC<PdfUploaderProps> = () => {
	const [pdfFile, setPdfFile] = useState<File | null>(null);
	const [pdfNumPages, setPdfNumPages] = useState<number | null>(null);
	const [imageFile, setImageFile] = useState<Blob | null>(null);
	const [pdfWithImage, setPdfWithImage] = useState<Uint8Array | null>(null);
	const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
	const [previewWidth, setPreviewWidth] = useState<number | null>(null);
	const documentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleSignatureBack = async () => {
			const response = await fetch('http://localhost:3001/api/v1/data/signature_file', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
			});
			if (response.ok) {
				setImageFile(await response.blob());
				setMousePosition(null); // Reset mouse position when a new image is uploaded
			}
		}

		handleSignatureBack();
  }, []);

	const memoizedFile = useMemo(() => ({ data: pdfWithImage }), [pdfWithImage]);

	const onDrop = async (acceptedFiles: File[]) => {
		const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
		
		if (pdfFile) {
			const formData = new FormData();
			formData.append('document', pdfFile);

			try {
				const response = await fetch('http://localhost:3001/api/v1/document/upload', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: formData,
				});
	
				if (response.ok) {
					console.log('PDF uploaded successfully');
					setPdfFile(pdfFile);
					setPdfNumPages(null);
					setPdfWithImage(null); // Reset modified PDF when a new PDF is uploaded
				} else {
					console.error(`Image upload failed, reason ${response.json()}`);
				}
			} catch (error) {
				console.error('Please upload a valid PDF file', error);
			}
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const handleDocumentMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (imageFile && documentRef.current) {
			const rect = documentRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top; // Adjust for scrolling
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
						mousePosition.x >= -rect.left &&
						mousePosition.x <= rect.right &&
						mousePosition.y >= -rect.top &&
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
						y: height - mousePosition.y, // Adjust the y-coordinate
						width: image.width * 0.25,
						height: image.height * 0.25,
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

	const sendSigningRequest = async () => {
		if (pdfWithImage) {
	  
			try {
			  const response = await fetch('http://localhost:3001/api/v1/sign/digital_signature', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				  	Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({
					pdf_file: pdfFile,
					page_num: 1,
					pfx_file: 1,
					password: '',
					x_indent: 1,
					y_indent: 1,
					height: 1,
					width: 1,
					img_file: 1
				}),
			  });
	  
			  if (response.ok) {

			  } else {
				console.error(`Image upload failed, reason ${response.json()}`);
			  }
			} catch (error) {
			  console.error('Error during image upload', error);
			}
		  }
	}


	useEffect(() => {
		if (documentRef.current && documentRef.current.firstChild) {
			const firstPage = documentRef.current.firstChild as HTMLElement;
			setPreviewWidth(firstPage.offsetWidth);
		}
	}, [pdfNumPages]);

	const dropzoneStyles: React.CSSProperties = {
		border: '2px dashed #cccccc',
		color: 'white',
		borderRadius: '4px',
		padding: '20px',
		textAlign: 'center',
		cursor: 'pointer',
		margin: '20px 0',
	};

	const pdfPreviewContainerStyles: React.CSSProperties = {
		alignContent: 'center',
		border: '1px solid #cccccc',
		margin: 'auto',
		width: previewWidth ? `${previewWidth}px` : '50%', // Set the width dynamically
		maxWidth: '650px',
	};

	return (
		<div>
			{!pdfFile && (<div {...getRootProps()} style={dropzoneStyles}>
				<input {...getInputProps()} />
				{isDragActive ? <p>Drop the PDF file here...</p> : <p>Drag 'n' drop a PDF file here, or click to select one</p>}
			</div>
			)}

			{pdfFile && (
				<div
					className="pdf-preview-container"
					style={pdfPreviewContainerStyles}
					onMouseDown={handleDocumentMouseDown}
					ref={documentRef}
				>
					<div style={{ height: '30rem', overflowY: 'auto'}}>
						<Document
							file={pdfFile}
							onLoadSuccess={({ numPages }) => {
								console.log('Original PDF loaded successfully. Number of pages:', numPages);
								setPdfNumPages(numPages);
							}}
						>
							{Array.from(new Array(pdfNumPages || 0), (el, index) => (
								<React.Fragment key={`page_${index + 1}`}>
									<div style={{ border: '1px solid #cccccc'}}>
										<Page pageNumber={index + 1} />
									</div>
								</React.Fragment>
							))}
						</Document>
					</div>
				</div>
			)}
			
			{mousePosition && (
				<Typography variant="h5" mb={1} fontWeight={500} color="primary.contrastText"> 
					Image will be inserted at: ({mousePosition.x}, {mousePosition.y})
				</Typography>
			)}
      <Button type="submit" variant="contained" fullWidth onClick={addImageToPdf} disabled={!pdfFile || !imageFile || !mousePosition}
      sx={{
        my: "1rem", 
        color: "primary.contrastText", 
        fontSize: "large",
        textTransform: "none", 
        backgroundColor: "primary.light",
        padding: "10px 30px",
        borderRadius: "1rem"
    }}>
        Add Image to PDF
      </Button>
	  <Button type="submit" variant="contained" fullWidth onClick={sendSigningRequest} disabled={!pdfWithImage}
      sx={{
        my: "1rem", 
        color: "primary.contrastText", 
        fontSize: "large",
        textTransform: "none", 
        backgroundColor: "primary.light",
        padding: "10px 30px",
        borderRadius: "1rem"
    }}>
        Sign the document
      </Button>
		</div>
	);
};

export default PdfUploader;
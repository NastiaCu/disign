import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  IconButton 
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {CloudDownloadOutlined} from '@mui/icons-material';

interface User {
  name: string;
  email: string;
}

interface Signature {
  filename: string;
}

interface Certificate {
  filename: string;
}

interface PDFs {
  filename: string;
  status: string;
  _id: string;
}

const Profile = () => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
  });
  const [signature, setSignature] = useState<Signature>({
    filename: '',
  });
  const [certificate, setCertificate] = useState<Certificate>({
    filename: '',
  });

  const [PDFs, setPDFs] = useState<Array<PDFs>>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pfxFile, setPfxFile] = useState<File | null>(null);


  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/v1/user/private_data', {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Handle error responses
          }
        } catch (error) {
          // Handle network errors
        }
      };
    

    const fetchUserPDFs = async () => {
      try {
        const pdfsResponse = await fetch('http://localhost:3001/api/v1/document/docs', {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (pdfsResponse.ok) {
          const pdfsData = await pdfsResponse.json();
          console.log(pdfsData)
          setPDFs(pdfsData);
        } else {
          // Handle error responses for PDFs data
        }
      } catch (error) {
        // Handle network errors for PDFs data
      }
  };

    const fetchUserSignature = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/data/signature', {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setSignature(userData);
        } else {
          setSignature({filename: ''})
          // Handle error responses
        }
      } catch (error) {
        // Handle network errors
      }
    };

    const fetchUserCertificate = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/data/certificate', {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setCertificate(userData);
        } else {
          setCertificate({filename: ''})
          // Handle error responses
        }
      } catch (error) {
        // Handle network errors
      }
    };
    fetchUserData();
    fetchUserPDFs();
    fetchUserSignature();
    fetchUserCertificate();
  }, []);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedImage = files[0];
      setImageFile(selectedImage);

      const previewURL = URL.createObjectURL(selectedImage);
      setImagePreview(previewURL);
    }
  };

  const handleImageUpload = async () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const response = await fetch('http://localhost:3001/api/v1/data/signature', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (response.ok) {
          console.log('Image uploaded successfully');
          setImageFile(null);
          setImagePreview(null);
          window.location.reload();
        } else {
          console.error(`Image upload failed, reason ${response.json()}`);
        }
      } catch (error) {
        console.error('Error during image upload', error);
      }
    }
  };

  const handleImageCheck = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/data/signature', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const imageData = await response.blob();
          console.log('Image already exists');
          // setImageFile(null);
          // setImagePreview(previewURL);
        } else {
          console.error(`Please upload image`);
        }
      } catch (error) {
        console.error('Error during image detection', error);
    }
  };

  const handlePfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPfxFile(files[0]);
    }
  };

  const handlePfxUpload = async () => {
    if (pfxFile) {
      const formData = new FormData();
      formData.append('file', pfxFile);

      try {
        const response = await fetch('http://localhost:3001/api/v1/data/certificate', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (response.ok) {
          console.log('.pfx file uploaded successfully');
          setPfxFile(null);
          window.location.reload();
        } else {
          console.error('.pfx file upload failed');
        }
      } catch (error) {
        console.error('Error during .pfx file upload', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleButtonClick = (pdfId: string, pdfStatus: string) => {
    if (pdfStatus == 'signed'){
      console.log(`Doc is ready to be downloaded`);
      const fetchDocument = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/v1/download/${pdfId}`, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
          if (response.ok) {
            const userData = await response.json();
            
          } else {
            
            // Handle error responses
          }
        } catch (error) {
          // Handle network errors
        }
      };
      fetchDocument();
    }
    else { 
      console.log(`Error`);
    }
  };

  return (
    <Container fixed maxWidth="md" sx={{ padding: "20px" }}>
      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: "40px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "primary.light",
              borderRadius: "2rem",
              boxShadow: 1,
              color: "primary.contrastText",
            }}
          >
            <Typography variant="h4" sx={{ mb: 4 }}>
              User Profile
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Name: {user.name}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Email: {user.email}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
              {imagePreview && <img src={imagePreview} alt="Selected" style={{ maxWidth: '100%', maxHeight: '300px' }} />}
              {imageFile ? (
                <Button variant="contained" onClick={handleImageUpload} sx={{ mt: 1 }}>
                  Upload Image
                </Button>
              ) :
                signature.filename != '' ? (
                  <Typography variant="body2" sx={{ color: '#96E9C6', fontStyle: 'italic', mt: 1 }}>
                    Signature {signature.filename} present in the database
                  </Typography>
                ) 
                : (
                  <Typography variant="body2" sx={{ color: 'error.main', fontStyle: 'italic', mt: 1 }}>
                    Please select an image to upload
                  </Typography>
                )
              }
            </Box>

            <Box sx={{ mb: 3 }}>
              <input type="file" accept=".pfx" onChange={handlePfxChange} />
              {pfxFile ? (
                <Button variant="contained" onClick={handlePfxUpload} sx={{ mt: 1 }}>
                  Upload .pfx File
                </Button>
              ) : 
                certificate.filename != '' ? (
                  <Typography variant="body2" sx={{ color: '#96E9C6', fontStyle: 'italic', mt: 1 }}>
                    Certificate {certificate.filename} present in the database
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: 'error.main', fontStyle: 'italic', mt: 1 }}>
                    Please select a .pfx file to upload
                  </Typography>
                )
              }
            </Box>

            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </Paper>
        </Grid>

        {/* PDFs Table */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: "40px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: "primary.light",
              borderRadius: "2rem",
              boxShadow: 1,
              color: "primary.contrastText",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Uploaded PDFs
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Download</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {PDFs.map((pdf) => (
                    <TableRow key={pdf._id}>
                      <TableCell>{pdf.filename}</TableCell>
                      <TableCell>{pdf.status}</TableCell>
                      <TableCell>
                      <IconButton onClick={() => handleButtonClick(pdf._id, pdf.status)}>
                        <CloudDownloadOutlined />
                      </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Profile;
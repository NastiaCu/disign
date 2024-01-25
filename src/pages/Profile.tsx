import React, { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
}

const Profile = () => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pfxFile, setPfxFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/user/signup', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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

    fetchUserData();
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
      formData.append('profileImage', imageFile);

      try {
        const response = await fetch('http://localhost:3001/api/v1/user/upload-image', {
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
        } else {
          console.error('Image upload failed');
        }
      } catch (error) {
        console.error('Error during image upload', error);
      }
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
      formData.append('pfxFile', pfxFile);

      try {
        const response = await fetch('http://localhost:3001/api/v1/user/upload-pfx', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (response.ok) {
          console.log('.pfx file uploaded successfully');
          setPfxFile(null);
        } else {
          console.error('.pfx file upload failed');
        }
      } catch (error) {
        console.error('Error during .pfx file upload', error);
      }
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>

      <div>
        <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="Selected" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          </div>
        )}
        <button onClick={handleImageUpload}>Upload Image</button>
      </div>

      <div>
        <input type="file" accept=".pfx" onChange={handlePfxChange} />
        <button onClick={handlePfxUpload}>Upload .pfx File</button>
      </div>
    </div>
  );
};

export default Profile;

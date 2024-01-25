// import React, { useEffect, useState } from 'react';

// interface User {
//     name: string;
//     email: string;
// }

// const Profile = () => {
//   const [user, setUser] = useState<User>({
//     name: '',
//     email: '',
//   });


//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch('http://localhost:3001/api/v1/user/signup', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });

//         if (response.ok) {
//           const userData = await response.json();
//           setUser(userData);
//         } else {
//           // Handle error responses
//         }
//       } catch (error) {
//         // Handle network errors
//       }
//     };

//     fetchUserData();
//   }, []);

//   return (
//     <div>
//       <h1>User Profile</h1>
//       <p>Name: {user.name}</p>
//       <p>Email: {user.email}</p>
//     </div>
//   );
// };

// export default Profile;



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

  // New state for the selected image file
  const [imageFile, setImageFile] = useState<File | null>(null);
  // State for image preview URL
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // New state for the selected .pfx file
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

  // Function to handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedImage = files[0];
      setImageFile(selectedImage);

      // Create a preview URL for the selected image
      const previewURL = URL.createObjectURL(selectedImage);
      setImagePreview(previewURL);
    }
  };

  // Function to handle image upload
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
          // Optionally, you can clear the file selection and preview after successful upload
          setImageFile(null);
          setImagePreview(null);
        } else {
          // Handle error responses
          console.error('Image upload failed');
        }
      } catch (error) {
        // Handle network errors
        console.error('Error during image upload', error);
      }
    }
  };

  // Function to handle .pfx file selection
  const handlePfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPfxFile(files[0]);
    }
  };

  // Function to handle .pfx file upload
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
          // Optionally, you can clear the file selection after successful upload
          setPfxFile(null);
        } else {
          // Handle error responses
          console.error('.pfx file upload failed');
        }
      } catch (error) {
        // Handle network errors
        console.error('Error during .pfx file upload', error);
      }
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>

      {/* Image upload input */}
      <div>
        <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
        {imagePreview && (
          <div>
            {/* Display a larger preview of the selected image */}
            <img src={imagePreview} alt="Selected" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          </div>
        )}
        <button onClick={handleImageUpload}>Upload Image</button>
      </div>

      {/* .pfx file upload input */}
      <div>
        <input type="file" accept=".pfx" onChange={handlePfxChange} />
        <button onClick={handlePfxUpload}>Upload .pfx File</button>
      </div>
    </div>
  );
};

export default Profile;

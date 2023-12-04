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

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;

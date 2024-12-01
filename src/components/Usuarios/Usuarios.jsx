import React, { useEffect, useState } from "react";

import { useSelector } from 'react-redux';
import TablaUsuarios from './TablaUsuarios'; 
import { verAllUsers } from "../../services/authService";

export const Usuarios = () => {
  const [users, setUsers] = useState([]); 
  const token = useSelector((state) => state.user.token); 

  const fetchUsers = async () => {
    try {
      const response = await verAllUsers(token);
      setUsers(response); 
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <TablaUsuarios users={users} token={token} fetchUsers={fetchUsers} /> 
    </div>
  );
};

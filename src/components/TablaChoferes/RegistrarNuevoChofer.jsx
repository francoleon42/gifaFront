import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@nextui-org/react';
import '../RegistroDeControlesRutinarios/styles/RegistroControlesRutinarios.css';
import { registrarChofer } from '../../services/choferesService';
import { showErrorAlert } from '../SweetAlert/SweetAlertError';
import { showsuccessAlert } from '../SweetAlert/SweetAlertSucces';

export const RegistrarNuevoChofer = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre: '',
  });

  const token = useSelector((state) => state.user.token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    
      await registrarChofer(formData, token);

    
      showsuccessAlert('¡Registro exitoso del chofer!',`El chofer ${formData.nombre} fue agregado correctamente`)
      
      
      setTimeout(() => {
       
        onCancel(); 
        onSubmit(formData);  
      }, 2000);
    } catch (error) {
      showErrorAlert(`No se puedo registrar el chofer ${formData.nombre}`,error)
    }
  };

  return (
    <div className="container">
      <h2>Registrar Nuevo Chofer</h2>
      
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Username
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Nombre
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <Button color="success" type="submit">Registrar chofer</Button>
        <Button color="danger" onClick={onCancel} style={{ marginBottom: '15px' }}>
          Cancelar
        </Button>
      </form>
    </div>
  );
};

export default RegistrarNuevoChofer;

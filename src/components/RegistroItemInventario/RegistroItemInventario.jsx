import React, { useState } from 'react';
import '../RegistroDeColectivo/styles/RegistroDeColectivo.css';
import { Button } from '@nextui-org/react';
import { registrarItem } from '../../services/inventarioService'; 
import { useSelector } from 'react-redux';
import { showsuccessAlert } from '../SweetAlert/SweetAlertSucces';
import { showErrorAlert } from '../SweetAlert/SweetAlertError';

export const RegistroItemInventario = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    umbral: 0,
    stock: 0,
    cantCompraAutomatica: 0,
  });

  const token = useSelector((state) => state.user.token); 

  const handleChange = (e) => {
    const { name, value } = e.target;

    
    if (name !== 'nombre' && value < 0) {
      alert('No se permiten valores negativos');
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registrarItem(formData, token);
      onSubmit(formData); 
      showsuccessAlert('¡Registro exitoso de item!','El item fue agregado correctamente')
    } catch (error) {
      showErrorAlert('Error al registrar un item',error)
    }
  };

  return (
    <div className="container">
      <h2>Registro de Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">
            Nombre:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="label">
            Umbral:
            <input
              type="number"
              name="umbral"
              value={formData.umbral}
              onChange={handleChange}
              min="0"  
              required
              className="input-field"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="label">
            Stock:
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"  
              required
              className="input-field"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="label">
            Cantidad para Compra Automática:
            <input
              type="number"
              name="cantCompraAutomatica"
              value={formData.cantCompraAutomatica}
              onChange={handleChange}
              min="0" 
              required
              className="input-field"
            />
          </label>
        </div>
        <div className='button-group'>
        <Button color='success' type="submit">Registrar Item</Button>
        <Button color='danger' type="button" onClick={onCancel}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
};

export default RegistroItemInventario;

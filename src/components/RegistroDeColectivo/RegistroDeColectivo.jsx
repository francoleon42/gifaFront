import React, { useState } from 'react';
import './styles/RegistroDeColectivo.css';
import { useSelector } from 'react-redux';
import { registrar } from "../../services/vehiculoService"; 
import { showsuccessAlert } from '../SweetAlert/SweetAlertSucces';
import { showErrorAlert } from '../SweetAlert/SweetAlertError';

export const RegistroDeColectivo = () => {
  const [formData, setFormData] = useState({
    patente: '',
    antiguedad: '',
    kilometrajeUsado: '',
    modelo: '',  
    fechaRevision: '',  
  });

  const token = useSelector((state) => state.user.token); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFormData = () => {
    const { patente, antiguedad, kilometrajeUsado, fechaRevision } = formData;
  
    
    const patenteRegex = /^(?:[A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\d{3})$/;
    if (!patenteRegex.test(patente.toUpperCase())) {
      alert("Formato de patente inválido. Debe ser '11AAA11' o 'AAA111'.");
      return false;
    }
  
    
    if (antiguedad < 0 || kilometrajeUsado < 0) {
      alert("Antigüedad y kilometraje no pueden ser negativos.");
      return false;
    }
  
   
    if (!Number.isInteger(parseFloat(kilometrajeUsado)) || kilometrajeUsado < 0) {
      alert("El kilometraje debe ser un número entero positivo en kilómetros.");
      return false;
    }
  
    
    if (new Date(fechaRevision) < new Date()) {
      alert("La fecha de revisión no puede ser anterior a la fecha actual.");
      return false;
    }
  
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateFormData()) {
      return; 
    }
  
  
    const [anio, mes, dia] = formData.fechaRevision.split('-');
    const fechaRevisionString = `${dia}/${mes}/${anio}`;  
  
  
    const dataToSubmit = {
      patente: formData.patente.toUpperCase(),
      antiguedad: parseInt(formData.antiguedad),
      kilometrajeUsado: parseInt(formData.kilometrajeUsado),  
      modelo: formData.modelo,
      fechaRevision: fechaRevisionString,
    };
  
    try {
      const response = await registrar(dataToSubmit, token);
      setFormData({
        patente: '',
        antiguedad: '',
        kilometrajeUsado: '',
        modelo: '',  
        fechaRevision: '',  
      });
  
      showsuccessAlert('¡Registro exitoso de colectivo!', 'El colectivo fue agregado correctamente');
    } catch (error) {
      showErrorAlert('Error al registrar un colectivo', error);
    }
  };
  

  return (
    <div className="container">
     
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">
            Patente:
            <input
              type="text"
              name="patente"
              value={formData.patente}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="label">
            Antigüedad:
            <input
              type="number"
              name="antiguedad"
              value={formData.antiguedad}
              onChange={handleChange}
              required
              className="input-field"
              min="0"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="label">
            Kilometraje usado:
            <input
              type="number"
              name="kilometrajeUsado"
              value={formData.kilometrajeUsado}
              onChange={handleChange}
              required
              className="input-field"
              min="0"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="label">
            Modelo:
            <input
              type="text"
              name="modelo" 
              value={formData.modelo}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="label">
            Fecha de Revisión:
            <input
              type="date"
              name="fechaRevision"  
              value={formData.fechaRevision}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>
        </div>
        <button type="submit" className="button">Registrar Colectivo</button>
      </form>
    </div>
  );
};

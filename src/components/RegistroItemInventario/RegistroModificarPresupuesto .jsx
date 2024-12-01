import React, { useState } from 'react';
import '../RegistroDeColectivo/styles/RegistroDeColectivo.css';
import { Button } from '@nextui-org/react';

export const RegistroModificarPresupuesto = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    presupuesto: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value),  
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const presupuesto = parseFloat(formData.presupuesto);
  

    if (presupuesto < 0) {
      alert('No se permiten valores negativos');
      return;
    }

    const data = {
      presupuesto, 
    };

    onSubmit(data);
  };

  return (
    <div className="container">
      <h2>Modificar Presupuesto</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">
            Nuevo Presupuesto:
            <input
              type="number"
              name="presupuesto"
              value={formData.presupuesto}
              onChange={handleChange}
              min="0"
              step="0.01"  
              required
              className="input-field"
            />
          </label>
        </div>
        <div className="button-group">
          <Button color="success" type="submit">Modificar</Button>
          <Button color="danger" type="button" onClick={onCancel}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
};

export default RegistroModificarPresupuesto;

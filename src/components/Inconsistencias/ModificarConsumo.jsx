import React, { useState } from 'react';
import '../RegistroDeColectivo/styles/RegistroDeColectivo.css';
import { Button } from '@nextui-org/react';

export const ModificarConsumo = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    consumoDeLitrosPorKm: 0,
  });

  const [error, setError] = useState(''); 

  const handleChange = (e) => {
    const { name, value } = e.target;

    
    if (isNaN(value)) {
      setError('El valor debe ser un número');
      return;
    }

   
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

   
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const consumoDeLitrosPorKm = parseFloat(formData.consumoDeLitrosPorKm);

    if (isNaN(consumoDeLitrosPorKm)) {
      setError('El consumo debe ser un número válido');
      return;
    }

    if (consumoDeLitrosPorKm < 1) {
      setError('No se permiten valores menores a 1');
      return;
    }

    const data = { consumoDeLitrosPorKm };
    onSubmit(data); 
  };

  return (
    <div className="container">
      <h2>Modificar Consumo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">
            Nuevo consumo de litros por km:
            <input
              type="number"
              name="consumoDeLitrosPorKm"
              value={formData.consumoDeLitrosPorKm}
              onChange={handleChange}
              min="1" 
              required
              className="input-field"
            />
          </label>
        </div>
        {error && <div className="error-message">{error}</div>} 
        <div className="button-group">
          <Button color="success" type="submit">Modificar</Button>
          <Button color="danger" type="button" onClick={onCancel}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
};

export default ModificarConsumo;

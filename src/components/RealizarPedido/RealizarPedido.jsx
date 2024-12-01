import React, { useState } from 'react';
import '../RegistroDeColectivo/styles/RegistroDeColectivo.css';
import { Button } from '@nextui-org/react';

export const RealizarPedido = ({ idItem, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    cantidad: 0,
    motivo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'cantidad' ? (isNaN(parseInt(value)) ? '' : parseInt(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cantidad = parseInt(formData.cantidad) || 0;  
    const motivo = formData.motivo.trim();

    if (cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    if (!motivo) {
      alert('Debe proporcionar un motivo');
      return;
    }

    const data = {
      cantidad,
      motivo,
      idItem,
    };

    onSubmit(data);
  };

  return (
    <div className="container">
      <h2>Realizar Pedido</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">
            Cantidad:
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad === 0 ? '' : formData.cantidad}  
              onChange={handleChange}
              min="1"
              step="1"
              required
              className="input-field"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="label">
            Motivo del Pedido:
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>
        </div>
        <div className="button-group">
          <Button color="success" type="submit">Enviar Pedido</Button>
          <Button color="danger" type="button" onClick={onCancel}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
};

export default RealizarPedido;

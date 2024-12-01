import React, { useState } from 'react';
import { cargarMantenimientoManual } from '../../services/mantenimientoService'; 
import { inhabilitar } from '../../services/vehiculoService';
import { useSelector } from 'react-redux';
import { Button } from '@nextui-org/react';
import '../RegistroDeControlesRutinarios/styles/RegistroControlesRutinarios.css';
import { showsuccessAlert } from '../SweetAlert/SweetAlertSucces';

const RegistrarMantenimiento = ({ vehiculoId, irAtras }) => { 
  const [formData, setFormData] = useState({
    asunto: '',
    vehiculo_id: vehiculoId,
  });

  const token = useSelector((state) => state.user.token); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
    
      await cargarMantenimientoManual(formData, token);
    
      
      showsuccessAlert('¡Mantenimiento registrado con éxito!','El mantenimeinto fue registrado correctamente')
      
      setTimeout(() => {
        irAtras(); 
      }, 2000); 
      
     
      setFormData({
        asunto: '',
        vehiculo_id: vehiculoId,
      });
      
    } catch (error) {
      showErrorAlert('Error al registrar el mantenimiento o inhabilitar el vehículo',error)
    }
  };

  return (
    <div className="container">
      <h2>Registrar Mantenimiento Manual</h2>


      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Asunto:
            <input
              type="text"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <Button color="success" type="submit">Registrar Mantenimiento</Button>
        <Button color="danger" onClick={irAtras} style={{ marginBottom: '15px' }}>
          Cancelar
        </Button>
      </form>
    </div>
  );
};

export default RegistrarMantenimiento;

import React, { useState } from 'react';
import PosicionesTiempoReal from './PosicionesTiempoReal';
import PosicionesEnRango from './PosicionesEnRango';
import { Button } from '@nextui-org/react';

export const Posiciones = () => {
  
  const [mostrarTiempoReal, setMostrarTiempoReal] = useState(true);

  
  const toggleComponent = () => {
    setMostrarTiempoReal((prevState) => !prevState);
  };

  return (
    <div>
      <div>
        <Button color='primary' className='m-3' onClick={toggleComponent}>
          {mostrarTiempoReal === null || !mostrarTiempoReal ?  'Posición en tiempo real' :'Posición en rango'}
        </Button>
      </div>

     
      {mostrarTiempoReal === null ? null : mostrarTiempoReal ? (
         <PosicionesTiempoReal />
       
      ) : (
        <PosicionesEnRango />
      )}
    </div>
  );
};

export default Posiciones;

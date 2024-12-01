import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import marcadorPersonalizado from '../../assets/icons/flag-checkered.png';  
import './styles/Posiciones.css';

const CustomIcon = L.icon({
  iconUrl: marcadorPersonalizado,
  iconSize: [32, 32], 
  iconAnchor: [15, 50],
  popupAnchor: [0, -50] 
});

const MapaPosiciones = ({ posiciones }) => {
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    if (posiciones.length > 0) {
      setCenter(posiciones[posiciones.length - 1]); 
    }
  }, [posiciones]);

  if (posiciones.length === 0) {
    return <p>El colectivo no tiene recorridos hechos.</p>;
  }

  const ultimaPosicion = posiciones[posiciones.length - 1];

  return (
    <MapContainer center={center} zoom={16} className="m-3" style={{ height: '500px', width: '80%' }} key={center.toString()}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
      />

      {posiciones.length > 1 && <Polyline positions={posiciones} color="blue" />}

      <Marker
        key="ultima-posicion"
        position={ultimaPosicion}
        icon={CustomIcon} 
      >
        <Popup>
          <div>Posición: {ultimaPosicion}</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapaPosiciones;

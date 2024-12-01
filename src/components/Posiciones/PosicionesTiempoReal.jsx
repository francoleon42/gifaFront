import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import L from 'leaflet';
import 'leaflet-realtime';
import './styles/Posiciones.css';
import { verPosiciones } from '../../services/traccar';
import iconBusqueda from '../../assets/icons/busqueda.png';

export const PosicionesTiempoReal = () => {
  const token = useSelector((state) => state.user?.token || '');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]); // Inicializamos con un array vacío
  const positionsRef = useRef([]);
  const mapRef = useRef(null);
  const polylineRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [buscarClickeado, setBuscarClickeado] = useState(false);

  const initializeMap = () => {
    if (!mapRef.current && mapContainerRef.current && positionsRef.current.length > 0) {
      const firstPosition = positionsRef.current[0];
      console.log('Initializing map with:', firstPosition);
      if (firstPosition.latitude !== undefined && firstPosition.longitude !== undefined) {
        mapRef.current = L.map(mapContainerRef.current).setView([firstPosition.latitude, firstPosition.longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(mapRef.current);

        polylineRef.current = L.polyline(positionsRef.current.map(pos => [pos.latitude, pos.longitude]), { color: 'blue' }).addTo(mapRef.current);
      } else {
        console.error('Invalid initial position:', firstPosition);
      }
    }
  };

  const updateRealtimeData = async () => {
    try {
      const response = await verPosiciones(id, token);

      if(response.length > 0){
        const nuevasPosiciones = response.map((pos) => ({ latitude: pos.latitude, longitude: pos.longitude }));
        setPositions(nuevasPosiciones);
        positionsRef.current = nuevasPosiciones;

        if (polylineRef.current) {
          polylineRef.current.setLatLngs(nuevasPosiciones.map(pos => [pos.latitude, pos.longitude]));
        }

        const lastPosition = nuevasPosiciones[nuevasPosiciones.length - 1];
        if (lastPosition && lastPosition.latitude !== undefined && lastPosition.longitude !== undefined && mapRef.current) {
          mapRef.current.setView([lastPosition.latitude, lastPosition.longitude], mapRef.current.getZoom());
        } else {
          console.error('Map is not initialized or last position is undefined');
        }
      }
    } catch (err) {
      console.error('Error fetching positions:', err);
    }
  };

  const fetchPosiciones = async () => {
    if (!id.trim()) {
      alert('Por favor, ingrese una patente.');
      return;
    }else{
      setBuscarClickeado(true);
    }

    setLoading(true);

    try {
      const response = await verPosiciones(id, token);

      if(response.length > 0){
        const posiciones = response.map((pos) => ({ latitude: pos.latitude, longitude: pos.longitude }));
        setPositions(posiciones);
        positionsRef.current = posiciones;
  
        if (!mapRef.current) {
          initializeMap();
        }
  
        if (polylineRef.current) {
          polylineRef.current.setLatLngs(posiciones.map(pos => [pos.latitude, pos.longitude]));
        }
  
        const lastPosition = posiciones[posiciones.length - 1];
        if (lastPosition && lastPosition.latitude !== undefined && lastPosition.longitude !== undefined && mapRef.current) {
          mapRef.current.setView([lastPosition.latitude, lastPosition.longitude], mapRef.current.getZoom());
        }
      }      
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    console.log('handleKeyPress called');
    if (event.key === 'Enter') {
      console.log('Enter key pressed');
      fetchPosiciones();
    }
  };

  const handleSearchClick = () => {
    fetchPosiciones();
  };

  useEffect(() => {
    if (positions.length > 0) {
      initializeMap();
      const interval = setInterval(updateRealtimeData, 5000);
      return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    }
  }, [positions]);

  return (
    <div className="container-posiciones">
      <h1>Recorrido de colectivo en tiempo real</h1>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value.toUpperCase())}
        placeholder="Ingrese la patente del colectivo"
        className="input-posiciones"
        onKeyPress={handleKeyPress}
      />
      <img
        src={iconBusqueda}
        alt="Buscar"
        className="search-icon-posiciones"
        onClick={handleSearchClick}
      />
      {loading ? (
        <p className="loading-message">Buscando recorrido...</p>
      ) : positions.length > 0 ? (
        <div ref={mapContainerRef} className="m-3 map-container" style={{ height: '500px', width: '80%' }}/>
      ) : (
        buscarClickeado && positions.length === 0 && (
          <p className="no-data-posiciones">El colectivo no tiene recorridos hechos.</p>
        )
      )
      }
    </div>
  );
};

export default PosicionesTiempoReal;

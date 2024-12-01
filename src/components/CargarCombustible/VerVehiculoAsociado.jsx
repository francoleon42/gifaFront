import React, { useEffect, useState } from 'react';
import { verVehiculoAsociado } from '../../services/choferesService';

export const VerVehiculoAsociado = ({ token }) => {
    const [vehiculoAsociado, setVehiculoAsociado] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchVehiculoAsociado = async () => {
        try {
            const response = await verVehiculoAsociado(token);
            setVehiculoAsociado(response);
        } catch (error) {
            console.error("Error fetching vehiculo:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchVehiculoAsociado();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            {vehiculoAsociado ? `Tu vehículo es: ${vehiculoAsociado.patente}` : "No hay vehículo asociado."}
        </div>
    );
};

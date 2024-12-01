import React, { useState, useEffect } from 'react';
import { verInconsistencias } from '../../services/traccar';
import { useSelector } from 'react-redux';
import TablaGenerica from '../TablaGenerica/TablaGenerica';
import './Inconsistencias.css';
import { showPresupuesto } from '../SweetAlert/SweetAlertPresupuesto';
import { modificarConsumo, obtenerPresupuesto } from '../../services/inventarioService';
import { showsuccessAlert } from '../SweetAlert/SweetAlertSucces';
import { showErrorAlert } from '../SweetAlert/SweetAlertError';
import ModificarConsumo from './ModificarConsumo';
import Loader from '../Loader/Loader';


export const Inconsistencias = () => {
    const token = useSelector((state) => state.user.token);
    const [filas, setFilas] = useState([]);
    const [showModificarConsumo, setShowModificarConsumo] = useState(false);
    const [loading, setLoading] = useState(false);

    const getStartOfDay = () => {
        const date = new Date();
        date.setHours(-3, 1, 0, 0);
        return date.toISOString().slice(0, 16);
    };

    const getEndOfDay = () => {
        const date = new Date();
        date.setHours(20, 59, 0, 0);
        return date.toISOString().slice(0, 16);
    };

    const formatISODate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('.')[0] + 'Z';
    };

    const [from, setFrom] = useState(getStartOfDay());
    const [to, setTo] = useState(getEndOfDay());

    const fetchData = async () => {
        setLoading(true);  
        try {
            const formattedFrom = formatISODate(from);
            const formattedTo = formatISODate(to);

            const response = await verInconsistencias(formattedFrom, formattedTo, token);
            const formattedData = response.map((item, index) => ({
                key: index.toString(),
                responsable: item.nombresDeResponsables.join(", ") || "Sin asignar",
                patente: item.vehiculo.patente,
                kilometrajeRecorrido: item.kilometrajeRecorrido,
                litrosCargados: item.litrosCargados,
            }));
            setFilas(formattedData);
        } catch (error) {
            console.error("Error fetching data: ", error.response ? error.response.data : error.message);
        } finally {
            setLoading(false); 
        }
    };

    const handleFromChange = (e) => {
        setFrom(e.target.value);
    };

    const handleToChange = (e) => {
        setTo(e.target.value);
    };

    const handleVerConsumo = async () => {
        try {
            const presupuesto = await obtenerPresupuesto(token);
            showPresupuesto(`El consumo de combustible por km es: $${presupuesto.consumoDeLitrosPorKm}`);
        } catch (error) {
            showPresupuesto(`Error al obtener el presupuesto: ${error.message}`);
        }
    };

    const handleModificarConsumo = async (data) => {
        try {
            const response = await modificarConsumo(data, token);
            if (response) {
                showsuccessAlert('¡Se modificó el consumo por km!', 'El consumo fue modificado correctamente');
                setShowModificarConsumo(false);
            }
        } catch (error) {
            showErrorAlert('Error al modificar el consumo', error);
        }
    };

    const columns = [
        { uid: "responsable", name: "Responsable" },
        { uid: "patente", name: "Patente" },
        { uid: "kilometrajeRecorrido", name: "Kilometraje Recorrido (km)" },
        { uid: "litrosCargados", name: "Litros Cargados" },
    ];

    const renderCell = (item, columnKey) => {
        return item[columnKey] !== undefined ? item[columnKey] : "-";
    };

    return (
        <>
            {loading ? (
                <>
                <div className="flex justify-center items-center h-full">
                  <Loader />
                </div>
                <div className="flex justify-center items-center h-full">
                  <h2>Cargando datos de inconsistencias...</h2>
                </div>
              </>
            ) : showModificarConsumo ? (
                <ModificarConsumo 
                onCancel={() => setShowModificarConsumo(false)} 
                onSubmit={handleModificarConsumo}
                />
            ) : (
                <>
                    <div>
                        <label htmlFor="from" className="label">Fecha y Hora Inicio:</label>
                        <input
                            type="datetime-local"
                            id="from"
                            value={from}
                            onChange={handleFromChange}
                            className="date-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="to" className="label">Fecha y Hora Fin:</label>
                        <input
                            type="datetime-local"
                            id="to"
                            value={to}
                            onChange={handleToChange}
                            className="date-input"
                        />
                    </div>
                    <div>
                        <button onClick={fetchData} className="search-button">Buscar</button>
                        <button onClick={handleVerConsumo} className="search-button">Ver consumo</button>
                        <button onClick={() => setShowModificarConsumo(true)} className="search-button">
                            Modificar consumo
                        </button>
                    
                    </div>

                    <TablaGenerica data={filas} columns={columns} renderCell={renderCell} />
                </>
            )}
        </>
    );
};

export default Inconsistencias;

import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { verMisMantenimientos } from "../../services/mantenimientoService";
import TablaGenerica from "../TablaGenerica/TablaGenerica";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import TarjetaMantenimiento from "./TajetaMantenimiento";



export function TareasFinalizadas() {
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        setIsLoading(true);  
        const response = await verMisMantenimientos(token);
      

        if (response && Array.isArray(response.mantenimientos)) {
          
          const mappedTasks = response.mantenimientos.map((task, index) => ({
            key: index.toString(),  
            id: task.id,
            asunto: task.asunto,
            operador: task.operador.usuario,  
            estadoMantenimiento: task.estadoMantenimiento,
            fechaInicio: task.fechaInicio,
            fechaFinalizacion: task.fechaFinalizacion,
            vehiculoPatente: task.vehiculo.patente, 
            vehiculoModelo: task.vehiculo.modelo,
            vehiculoAntiguedad: task.vehiculo.antiguedad,
            vehiculoKilometraje: task.vehiculo.kilometraje,
          }));
          setTareas(mappedTasks);  
        } else {
          console.error("La respuesta no contiene un array de mantenimientos:", response);
          setTareas([]); 
        }
      } catch (error) {
        console.error("Error al obtener las tareas: ", error);
        setTareas([]);  
      } finally {
        setIsLoading(false);  
      }
    };

    if (token) {
      fetchTareas();
    }
  }, [token]);

  
  const tareasFinalizadas = tareas.filter(task => task.estadoMantenimiento === 'FINALIZADO');

  const columns = [
    { name: "Asunto", uid: "asunto" },
    { name: "Vehículo", uid: "vehiculoPatente" },
    { name: "Acciones", uid: "acciones" }
  ];

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "id":
        return item.id;
      case "asunto":
        return item.asunto;
      case "operador":
        return item.operador;  
      case "vehiculoPatente":
        return item.vehiculoPatente;
      case "fechaInicio":
        return item.fechaInicio;
      case "fechaFinalizacion":
        return item.fechaFinalizacion;
      case "acciones":
        return (
          <Button onClick={() => handleViewDetails(item)} color="primary">
            Ver Detalle
          </Button>
        );
      default:
        return "";
    }
  };

  
  const handleViewDetails = (task) => {
    setSelectedTask(task);
  };

  return (
      <div>
        {isLoading ? (
          <>
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
            <div className="flex justify-center items-center h-full">
              <h2>Cargando tareas...</h2>
            </div>
          </>
        ) : (
            !selectedTask && ( 
              <TablaGenerica
                data={tareasFinalizadas}
                columns={columns}
                renderCell={renderCell}
                topContent={<h2>Tareas finalizadas</h2>}
              />
            )
          )}
      
          {selectedTask && ( 
            <TarjetaMantenimiento task={selectedTask} token={token} onClose={() => setSelectedTask(null)} />
          )}
      </div>
    );
    
}

export default TareasFinalizadas;

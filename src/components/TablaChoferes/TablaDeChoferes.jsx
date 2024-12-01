import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Input, Button } from "@nextui-org/react";
import TablaGenerica from "../TablaGenerica/TablaGenerica";
import { RegistrarNuevoChofer } from "./RegistrarNuevoChofer";
import { verChoferes, asignarChofer } from "../../services/choferesService";
import fetchVehiculosDisponibles from "./FetchVehiculosDisponible";
import { SweetAlertAsignar } from "../SweetAlert/SweetAlertAsignar";
import Loader from "../Loader/Loader";

export function TablaDeChoferes() {
  const [filas, setFilas] = useState([]);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [choferIdSeleccionado, setChoferIdSeleccionado] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [mostrarRegistroDeChofer, setMostrarRegistroDeChofer] = useState(false);
  const [loading, setLoading] = useState(true);
  const { role } = useSelector((state) => state.user);
  const token = useSelector((state) => state.user.token);

  const columns = useMemo(() => [
    { uid: "nombre", name: "NOMBRE" },
    { uid: "vehiculoAsociado", name: "VEHÍCULO ASOCIADO" },
    ...(role !== "ADMINISTRADOR" ? [{ uid: "actions", name: "ACCIONES" }] : []),
  ], [role]);

  const fetchChoferes = async () => {
    setLoading(true);
    try {
      const response = await verChoferes(token);
     
      if (response) {
        const mappedRows = response.map((item, index) => ({
          key: index.toString(),
          id: item.idChofer,
          nombre: item.nombre,
          vehiculoAsociado: item.patente ? item.patente : 'Sin vehiculo asociado',
        }));
        setFilas(mappedRows); 
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const asignarVehiculo = async (idChofer) => {
    setChoferIdSeleccionado(idChofer);
    const vehiculosDisponibles = await fetchVehiculosDisponibles(token);
    SweetAlertAsignar({
      choferId: idChofer,
      vehiculosDisponibles,
      onAsignar: handleAsignarVehiculo,
    });
  };

  const handleAsignarVehiculo = async (vehiculoSeleccionado,idChofer) => {
    if (vehiculoSeleccionado && idChofer) {
      const data = {
        idVehiculo: vehiculoSeleccionado,
        idChofer: idChofer,
      };
      try {
        await asignarChofer(data, token);
        await fetchChoferes();  
      } catch (error) {
        console.error("Error al asignar el vehículo: ", error);
      }
    }
  };

  useEffect(() => {
    fetchChoferes();
  }, [token]);

  const filteredRows = useMemo(() => {
    return filas.filter(
      (row) =>
        (filterStatus === "all" || row.estado === filterStatus) &&
        row.nombre?.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filas, filterValue, filterStatus]);

  const topContent = (
    <div className="flex justify-between items-end mb-4">
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        placeholder="Buscar por nombre..."
        value={filterValue}
        onClear={() => setFilterValue("")}
        onValueChange={setFilterValue}
      />
      {role === "ADMINISTRADOR" && 
        <Button onClick={() => setMostrarRegistroDeChofer(true)} color="primary">
          Registrar chofer
        </Button>
      }
    </div>
  );

  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div>
            {role === "SUPERVISOR" && (
              <Button color="warning" onClick={() => asignarVehiculo(item.id)}>
                Asignar Vehículo
              </Button>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div>
      {loading ? (
         <>
         <div className="flex justify-center items-center h-full">
           <Loader />
         </div>
         <div className="flex justify-center items-center h-full">
           <h2>Cargando choferes...</h2>
         </div>
       </>
      ) : !mostrarRegistroDeChofer ? (
        <>
          <TablaGenerica
            data={filteredRows}
            columns={columns}
            renderCell={renderCell}
            topContent={topContent}
          />
        </>
      ) : (
        <RegistrarNuevoChofer onSubmit={() => setMostrarRegistroDeChofer(false)} />
      )}
    </div>
  );
}

export default TablaDeChoferes;

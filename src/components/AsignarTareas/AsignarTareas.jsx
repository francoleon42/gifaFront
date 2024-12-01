import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { verMantenimientosPendientes, asignarMantenimiento } from "../../services/mantenimientoService";
import Loader from "../Loader/Loader";
import { Button, Input } from "@nextui-org/react";
import TablaGenerica from "../TablaGenerica/TablaGenerica";
import { showsuccessAlert } from "../SweetAlert/SweetAlertSucces";


const columns = [
  { uid: "patente", name: "Patente" },
  { uid: "asunto", name: "Asunto" },
  { uid: "acciones", name: "Acciones" },
];

export function AsignarMantenimiento({ userRole }) {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");

  const token = useSelector((state) => state.user.token);

  const fetchMantenimientosPendientes = async () => {
    setIsLoading(true);
    try {
      const response = await verMantenimientosPendientes(token); 
      if (response && response.mantenimientos) {
        const mappedRows = response.mantenimientos.map((item, index) => {
          return {
            key: index.toString(),
            id: item.id,
            patente: item.vehiculo.patente, 
            asunto: item.asunto,
          };
        });
        setMantenimientos(mappedRows);
      }
    } catch (error) {
      console.error("Error al obtener los mantenimientos pendientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMantenimientosPendientes();
  }, [token]);

  const handleAsignarMantenimiento = async (id) => {
    try {
      await asignarMantenimiento(id, token); 
      showsuccessAlert('¡Mantenimiento asignado!', "El mantenimiento fue asignado correctamente.");
      fetchMantenimientosPendientes(); 
    } catch (error) {
      showErrorAlert('No se pudo asignar mantenimiento', error);
    }
  };

  const filteredRows = useMemo(() => {
    return mantenimientos.filter((row) =>
      row.patente.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [mantenimientos, filterValue]);

  const topContent = (
    <div className="inputContainer">
      <Input
        isClearable
        className="w-full"
        placeholder="Buscar por patente..."
        value={filterValue}
        onClear={() => setFilterValue("")}
        onValueChange={setFilterValue}
      />
    </div>
  );

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "acciones":
        return (
          <Button
            color="primary"
            onClick={() => handleAsignarMantenimiento(item.id)}
          >
            Asignar
          </Button>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <div>
      {isLoading ? (
        <>
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
        <div className="flex justify-center items-center h-full">
          <h2>Cargando colectivos...</h2>
        </div>
      </>
      ) : (
        <TablaGenerica
          data={filteredRows}
          columns={columns}
          renderCell={renderCell}
          topContent={topContent}
        />
      )}
    </div>
  );
}

export default AsignarMantenimiento;

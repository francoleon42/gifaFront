import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import VerDetalleMantenimiento from "../VerDetalleColectivo/VerDetalleMantenimiento";
import { verMantenimientos } from "../../services/mantenimientoService";
import TablaGenerica from "../TablaGenerica/TablaGenerica";
import { Button, Input } from "@nextui-org/react";

const columns = [
  { uid: "patente", name: "PATENTE" },
  { uid: "fechaInicio", name: "FECHA DEL MANTENIMIENTO" },
  { uid: "realizadoPor", name: "REALIZADO POR" },
  { uid: "actions", name: "ACCIONES" },
];

export function HistorialDeMantenimientos() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const cargarMantenimientos = async () => {
      try {
        const response = await verMantenimientos(token);
        console.log(response)
        if (response && Array.isArray(response.mantenimientos)) {
          const mappedRows = response.mantenimientos.map((item, index) => {
            const [anio, mes, dia] = item.fechaInicio.split("-");
            const fechaFormateadaInicio = `${dia}/${mes}/${anio}`;
            const [anios, mess, dias] = item.fechaFinalizacion.split("-");
            const fechaFormateadaFinal = `${dias}/${mess}/${anios}`;
  
            return {
              key: index.toString(),
              patente: item.vehiculo.patente,
              fechaInicio: fechaFormateadaInicio,
              fechaFinalizacion: fechaFormateadaFinal,
              repuesto: item.itemUtilizado?.length
                ? agruparItems(item.itemUtilizado).join(", ")
                : "No especificado",
              realizadoPor: item.operador?.usuario || "Operador no especificado",
              idVehiculo: item.vehiculo.id,
            };
          });
          setMantenimientos(mappedRows);
        } else {
          setMantenimientos([]);
        }
      } catch (error) {
        console.error("Error al cargar los mantenimientos:", error);
        setMantenimientos([]);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
  
    cargarMantenimientos();
  }, [token]);
  

  const agruparItems = (items) => {
    const itemsMap = {};
    items.forEach((utilizado) => {
      if (itemsMap[utilizado.item]) {
        itemsMap[utilizado.item] += utilizado.cantidad;
      } else {
        itemsMap[utilizado.item] = utilizado.cantidad;
      }
    });
    return Object.entries(itemsMap).map(([item, cantidad]) => `${item} (Cantidad: ${cantidad})`);
  };

  const handleVerDetalle = (mantenimiento) => {
    setSelectedMantenimiento(mantenimiento);
  };

  const handleIrAtras = () => {
    setSelectedMantenimiento(null);
  };

  const filteredMantenimientos = useMemo(() => {
    return mantenimientos.filter((mantenimiento) =>
      mantenimiento.patente.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [mantenimientos, filterValue]);

  const topContent = (
    <div className="flex justify-between items-end mb-4">
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        placeholder="Buscar por patente..."
        value={filterValue}
        onClear={() => setFilterValue("")}
        onValueChange={setFilterValue}
      />
    </div>
  );

  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "actions":
        return (
          <div>
            <Button
              color="primary"
              variant="shadow"
              onClick={() => handleVerDetalle(item)}
            >
              Ver Detalle
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div>
      {selectedMantenimiento ? (
        <VerDetalleMantenimiento
          idVehiculo={selectedMantenimiento.idVehiculo}
          token={token}
          irAtras={handleIrAtras}
        />
      ) : (
        <>
          {isLoading ? (
            <>
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
            <div className="flex justify-center items-center h-full">
              <h2>Cargando mantenimientos...</h2>
            </div>
            </>
          ) : (
            <TablaGenerica
              data={filteredMantenimientos}
              columns={columns}
              renderCell={renderCell}
              topContent={topContent}
            />
          )}
        </>
      )}
    </div>
  );
}

export default HistorialDeMantenimientos;

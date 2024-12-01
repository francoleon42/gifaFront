import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from 'react-redux';
import Loader from "../Loader/Loader";
import { Input, Button, Chip } from "@nextui-org/react";
import TablaGenerica from "../TablaGenerica/TablaGenerica";
import { confirmarPedidoRecibido, verPedidosAceptados } from "../../services/proveedoresYPedidosController";
import { showsuccessAlert } from "../SweetAlert/SweetAlertSucces";

const columns = [
    { uid: "nombre", name: "NOMBRE" },
    { uid: "fecha", name: "FECHA" },
    { uid: "cantidad", name: "CANTIDAD" },
    { uid: "motivo", name: "MOTIVO" },
    { uid: "estado", name: "ESTADO" },
    { uid: "acciones", name: "ACCIONES" },
];

export function TablaPedidosAceptados() {
    const [filas, setFilas] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [loading, setLoading] = useState(true);
    const token = useSelector((state) => state.user.token);

    const fetchData = async () => {
        setLoading(true);
        try {
          const response = await verPedidosAceptados(token);
          if (response) {
            const mappedRows = response.map((item, index) => {
              const formattedDate = item.fecha
                ? (() => {
                    const dateObj = new Date(item.fecha);
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const year = dateObj.getFullYear();
                    return `${day}-${month}-${year}`;
                  })()
                : "Sin fecha";
      
              return {
                key: index.toString(),
                idPedido: item.idPedido,
                nombre: item.item.nombre,
                fecha: formattedDate,
                cantidad: item.cantidad,
                motivo: item.motivo,
                estado: item.estadoPedido,
              };
            });
            setFilas(mappedRows);
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setLoading(false);
        }
      };
      

    const confirmarPedido = async (id) => {

        try {
            await confirmarPedidoRecibido(id, token);
            showsuccessAlert('¡Pedido confirmado!','Los ítems han sido sumados al stock')
            fetchData();
        } catch (error) {
            showErrorAlert('Error al confirmar el pedido',error)
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const filteredRows = useMemo(() =>
        filas.filter((fila) => fila.nombre.toLowerCase().includes(filterValue.toLowerCase())),
        [filas, filterValue]
    );

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
        </div>
    );

    const renderCell = (item, columnKey) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case "estado":
                return (
                    <Chip className="capitalize" color="success" size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "acciones":
                return (
                    <Button color="success" size="sm" onClick={() => confirmarPedido(item.idPedido)}>
                        Confirmar
                    </Button>
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
                 <h2>Cargando pedidos aceptados...</h2>
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

export default TablaPedidosAceptados;

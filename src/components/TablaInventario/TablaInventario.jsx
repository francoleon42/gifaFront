import React, { useEffect, useState, useMemo } from "react";
import { Input, Button } from "@nextui-org/react";
import { obtenerItems, modificarPresupuesto, obtenerPresupuesto } from "../../services/inventarioService";
import { useSelector } from "react-redux";
import TablaGenerica from "../TablaGenerica/TablaGenerica";
import RegistroItemInventario from "../../components/RegistroItemInventario/RegistroItemInventario";
import RegistroModificarPresupuesto from "../../components/RegistroItemInventario/RegistroModificarPresupuesto ";
import { RealizarPedido } from "../RealizarPedido/RealizarPedido";
import { showsuccessAlert } from "../SweetAlert/SweetAlertSucces";
import { showErrorAlert } from "../SweetAlert/SweetAlertError";
import { generarPedido } from "../../services/proveedoresYPedidosController";
import Loader from "../Loader/Loader";
import { showPresupuesto } from "../SweetAlert/SweetAlertPresupuesto";
import '../TablaColectivos/styles/filtros.css'

const columns = [
  { uid: "nombre", name: "NOMBRE" },
  { uid: "umbral", name: "UMBRAL" },
  { uid: "stock", name: "STOCK" },
  { uid: "cantCompraAutomatica", name: "CANT. COMPRA AUTOMÁTICA" },
  { uid: "acciones", name: "ACCIONES" },
];

export function TablaDeInventario({ userRole, onItemSeleccionado }) {
  const [filas, setFilas] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [showRegistro, setShowRegistro] = useState(false);
  const [showModificarPresupuesto, setShowModificarPresupuesto] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showRealizarPedido, setShowRealizarPedido] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
       
        setTimeout(async () => {
          const items = await obtenerItems(token);
          const mappedRows = items.map((item, index) => ({
            key: index.toString(),
            id: item.id,
            nombre: item.nombre,
            umbral: item.umbral,
            stock: item.stock,
            cantCompraAutomatica: item.cantCompraAutomatica,
          }));
          setFilas(mappedRows);
          setLoading(false); 
        }, 300); 
      } catch (error) {
        console.error("Error al obtener los artículos:", error);
        setLoading(false); 
      }
    };
    fetchItems();
  }, [token]);

  const filteredRows = useMemo(() => {
    return filas.filter((row) =>
      row.nombre.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filas, filterValue]);

  const handleRegistroSubmit = (nuevoItem) => {
    setFilas((prevFilas) => [
      ...prevFilas,
      {
        key: (prevFilas.length + 1).toString(),
        ...nuevoItem,
      },
    ]);
    setShowRegistro(false);
  };

  const handleUtilizarClick = (itemId, itemNombre) => {
    onItemSeleccionado(itemId, itemNombre);
  };

  const handleRealizarPedidoClick = (itemId) => {
    setSelectedItemId(itemId);
    setShowRealizarPedido(true);
  };

  const handleModificarPresupuesto = async (data) => {
    try {
      const response = await modificarPresupuesto(data, token);
      if (response) {
        showsuccessAlert('¡Se modificó el presupuesto!', 'El presuspuesto fue modificado correctamente');
        setShowModificarPresupuesto(false);
      }
    } catch (error) {
      showErrorAlert('Error al modificar el presupuesto', error);
    }
  };

  const handlePedidoSubmit = async (data) => {
    try {
      const response = await generarPedido(data, token);
      if (response) {
        showsuccessAlert('¡Pedido realizado!', 'El pedido fue realizado correctamente');
        setShowRealizarPedido(false);
      }
    } catch (error) {
      showErrorAlert('Error al generar un pedido', error.message);
    }
  };

  const handleVerPresupuesto = async () => {
    try {
      const presupuesto = await obtenerPresupuesto(token);
      showPresupuesto(`El presupuesto actual es: $${presupuesto.presupuesto}`);
      // \n El consumo de combustible por km es: ${presupuesto.consumoDeLitrosPorKm} 
    } catch (error) {
      showPresupuesto(`Error al obtener el presupuesto: ${error.message}`);
    }
  };

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "acciones":
        switch (userRole) {
          case "OPERADOR":
            return (
              <Button onClick={() => handleUtilizarClick(item.id, item.nombre)} color="success">
                Utilizar
              </Button>
            );
          case "SUPERVISOR":
            return (
              <Button onClick={() => handleRealizarPedidoClick(item.id)} color="success">
                Realizar pedido
              </Button>
            );
          default:
            return null;
        }
      default:
        return item[columnKey];
    }
  };

  const topContent = (
    <div className="flex  items-center mb-4">
      <Input
      className=""
        isClearable
        placeholder="Buscar por nombre"
        value={filterValue}
        onClear={() => setFilterValue("")}
        onValueChange={setFilterValue}
      />
      <div className="button-group">
      {userRole === "ADMINISTRADOR" && (
        <Button onClick={() => setShowRegistro(true)} color="primary">
          Agregar Item
        </Button>
      )}
      {userRole === "SUPERVISOR" && (
        <Button className="pl-5" onClick={() => setShowModificarPresupuesto(true)} color="primary">
          Modificar presupuesto
        </Button>
      )}
      {userRole === "SUPERVISOR" && (
        <Button color="primary" onClick={handleVerPresupuesto}>Ver presupuesto</Button>
      )}
      </div>
    </div>
  );

  const filteredColumns = useMemo(() => {
    if (userRole === "OPERADOR") {
      return columns.filter((col) => col.uid !== "cantCompraAutomatica");
    }
    if (userRole === "ADMINISTRADOR") {
      return columns.filter((col) => col.uid !== "acciones");
    }
    return columns;
  }, [userRole]);

  return (
    <>
      {loading ? (
        <>
          <div className="flex justify-center items-center h-full">
            <Loader />
          </div>
          <div className="flex justify-center items-center h-full">
            <h2>Cargando inventario...</h2>
          </div>
        </>
      ) : showRegistro && userRole === "ADMINISTRADOR" ? (
        <RegistroItemInventario onSubmit={handleRegistroSubmit} onCancel={() => setShowRegistro(false)} />
      ) : showModificarPresupuesto ? (
        <RegistroModificarPresupuesto
          onCancel={() => setShowModificarPresupuesto(false)}
          onSubmit={handleModificarPresupuesto}
        />
      ) : showRealizarPedido ? (
        <RealizarPedido
          idItem={selectedItemId}
          onCancel={() => setShowRealizarPedido(false)}
          onSubmit={handlePedidoSubmit}
        />
      ) : (
        <TablaGenerica
          data={filteredRows}
          columns={filteredColumns}
          renderCell={renderCell}
          topContent={topContent}
        />
      )}
    </>
  );
}

export default TablaDeInventario;

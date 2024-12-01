import React, { useEffect, useState, useMemo } from "react";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useSelector } from "react-redux";
import TablaGenerica from "../TablaGenerica/TablaGenerica";
import RegistroDeAsociacionDeItem from "../RegistroDeAsociacionDeItem/RegistroDeAsociacionDeItem";
import { verProveedoresDeItems } from "../../services/proveedoresYPedidosController";
import Loader from "../Loader/Loader";
import '../TablaColectivos/styles/filtros.css'

const columns = [
  { uid: "item", name: "NOMBRE DEL ITEM" },
  { uid: "proveedor", name: "NOMBRE" },
  { uid: "emailProveedor", name: "EMAIL" },
  { uid: "precio", name: "PRECIO" },
];

export function TablaDeProveedores() {
  const [filas, setFilas] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [showAsociarItem, setShowAsociarItem] = useState(false);
  const [loading, setLoading] = useState(false); 
  const token = useSelector((state) => state.user.token);

  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const proveedoresData = await verProveedoresDeItems(token); 
      const mappedRows = proveedoresData.map((entry, index) => ({
        key: index.toString(),
        id: entry.item.id,
        item: entry.item.nombre,
        proveedor: entry.proveedor.nombre,
        emailProveedor: entry.proveedor.email,
        precio: entry.precio,
      }));
      setFilas(mappedRows);
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
      setFilas([]); 
    } finally {
      
      setTimeout(() => setLoading(false), 500); 
    }
  };

  useEffect(() => {
    fetchProveedores(); 
  }, [token]); 

  const handleOnCancel = () => {
    setShowAsociarItem(false);
    fetchProveedores(); 
  };

  const filteredRows = useMemo(() => {
    return filas.filter((row) =>
      row.item.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.proveedor.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.emailProveedor.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filas, filterValue]);

  const renderCell = (item, columnKey) => {
    return item[columnKey];
  };

  const topContent = (
    <div className="flex justify-between items-center mb-4">
      <Input
        isClearable
        placeholder="Buscar por item, proveedor o email"
        value={filterValue}
        onClear={() => setFilterValue("")}
        onValueChange={setFilterValue}
      />
      <div className="button-group">
      <Button   onClick={() => setShowAsociarItem(true)} color="primary">
        Asociar nuevo item
      </Button>
      </div>
    </div>
  );

  return (
    <>
      {showAsociarItem ? (
        <RegistroDeAsociacionDeItem onCancel={handleOnCancel} />
      ) : loading ? ( 
        <>
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
        <div className="flex justify-center items-center h-full">
          <h2>Cargando proveedores...</h2>
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
    </>
  );
}

export default TablaDeProveedores;

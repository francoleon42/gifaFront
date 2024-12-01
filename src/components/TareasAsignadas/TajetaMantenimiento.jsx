import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Image, Button } from "@nextui-org/react";
import mantenimientoImagen from '../../assets/Images/LogoNavBar.jpeg';
import { finalizarMantenimiento } from '../../services/mantenimientoService';
import { utilizarItem } from '../../services/inventarioService';
import TablaDeInventario from '../TablaInventario/TablaInventario';
import { showsuccessAlert } from '../SweetAlert/SweetAlertSucces';
import { showErrorAlert } from '../SweetAlert/SweetAlertError';
import iconCross from '../../assets/icons/cross.png';

const TarjetaMantenimiento = ({ task, token, onClose}) => {
  const [itemsUsados, setItemsUsados] = useState([]);
  const [mostrarInventario, setMostrarInventario] = useState(false);
 

  const handleFinalizarTarea = async () => {
    try {
      if (itemsUsados.length === 0) {
        alert("Por favor, seleccione al menos un ítem para descontar del stock");
        return;
      }

      for (const item of itemsUsados) {
        try {
          const data = { cantidadADisminuir: item.cantidad };
          await utilizarItem(item.id, data, token);
        } catch (error) {
          showErrorAlert(`Error al descontar el ítem ${item.nombre}`, error);
          return;
        }
      }

      const data = {
        items: itemsUsados.map(item => ({
          idItem: item.id,
          cantidad: item.cantidad,
        })),
      };

      await finalizarMantenimiento(task.id, data, token);
      showsuccessAlert('¡Tarea finalizada!', 'Los ítems han sido descontados del stock');
      onClose()

  

    } catch (error) {
      showErrorAlert('Error al finalizar la tarea', error);
    }
  };

  const handleItemSeleccionado = (id, nombre) => {
    const existe = itemsUsados.find(item => item.id === id);
    if (existe) {
      alert("Este ítem ya ha sido seleccionado.");
      return;
    }

    setItemsUsados([...itemsUsados, { id, nombre, cantidad: 1 }]);
    setMostrarInventario(false);
  };

  const handleCantidadChange = (id, cantidad) => {
    const cantidadNumerica = parseInt(cantidad);

    if (cantidad === "" || cantidadNumerica >= 1) {
      setItemsUsados(itemsUsados.map(item =>
        item.id === id ? { ...item, cantidad: cantidad === "" ? "" : cantidadNumerica } : item
      ));
    } else {
      alert("La cantidad no puede ser menor que 1");
    }
  };

  const handleEliminarItem = (id) => {
    setItemsUsados(itemsUsados.filter(item => item.id !== id));
  };

  const handleOcultarInventario = () => {
    setMostrarInventario(false);
    setItemsUsados([]);
  };

  return (
    <Card className="max-w-[400px]" key={task.id}>
      <CardHeader className="flex gap-3">
        <Image
          alt="Imagen de la tarea"
          height={40}
          radius="sm"
          src={mantenimientoImagen}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md font-bold">{task.asunto}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p><strong>Estado:</strong> {task.estadoMantenimiento}</p>
        <p><strong>Vehículo:</strong> {task.vehiculoPatente}</p>
        <p><strong>Modelo:</strong> {task.vehiculoModelo}</p>
        <p><strong>Antigüedad:</strong> {task.vehiculoAntiguedad} años</p>
        <p><strong>Kilometraje:</strong> {task.vehiculoKilometraje} km</p>
        <p><strong>Asunto:</strong> {task.asunto}</p>

        {task.estadoMantenimiento !== "FINALIZADO" && (
          <Button
            color="primary"
            onClick={() => setMostrarInventario(true)}
          >
            Seleccionar Repuesto
          </Button>
        )}

        {mostrarInventario && (
          <>
            <TablaDeInventario userRole="OPERADOR" onItemSeleccionado={handleItemSeleccionado} />
            <Button color="danger" onClick={handleOcultarInventario}>
              Cancelar
            </Button>
          </>
        )}

        {itemsUsados.length > 0 && (
          <div className="mt-4">
            <h4>Repuestos seleccionados:</h4>
            {itemsUsados.map(item => (
              <div key={item.id} >
                <p>{item.nombre}</p>
                <label htmlFor={`cantidad-${item.id}`}>Cantidad:</label>
                <input
                  type="number"
                  id={`cantidad-${item.id}`}
                  value={item.cantidad}
                  onChange={(e) => handleCantidadChange(item.id, e.target.value)}
                  min="1"
                  step="1"
                />

                <Image
                  alt="Eliminar"
                  onClick={() => handleEliminarItem(item.id)}
                  src={iconCross}

                />

              </div>
            ))}
          </div>
        )}
      </CardBody>
      <Divider />
      <CardFooter>
        {task.estadoMantenimiento !== "FINALIZADO" && (
          <Button
            color="secondary"
            onClick={handleFinalizarTarea}
          >
            Finalizar Tarea
          </Button>
        )}
        <Button
            color="danger"
            onClick={onClose}
          >
            volver
          </Button>

      </CardFooter>
    </Card>
  );
};

export default TarjetaMantenimiento;

import React from 'react';
import { useSelector } from 'react-redux'; 
import TablaDeColectivos from '../TablaColectivos/TablaColectivos';
import { RegistroDeColectivo } from '../RegistroDeColectivo/RegistroDeColectivo';
import { HistorialDeMantenimientos } from '../HistorialDeMantenimiento/HistorialDeMantenimientos';
import AsignarTareas from '../AsignarTareas/AsignarTareas';
import { TareasAsignadas } from '../TareasAsignadas/TareasAsignadas';
import TablaDeChoferes from '../TablaChoferes/TablaDeChoferes';
import { MetricaBitacora } from '../../MetricasGlobales/MetricaBitacora/MetricaBitacora';
import { MetricaStock } from '../../MetricasGlobales/MetricaStock/MetricaStock';
import { MetricaFlota } from '../../MetricasGlobales/MetricaFlota/MetricaFlota';
import TablaPedidosRealizados from '../TablaPedidos/TablaPedidosRealizados';
import { RegistroProveedor } from '../RegistroProveedor.jsx/RegistroProveedor';
import TablaDeInventario from '../TablaInventario/TablaInventario';
import { TablaDeProveedores } from '../TablaProveedores/TablaProveedores';
import TablaPedidosAceptados from '../TablaPedidos/TablaPedidosAceptados';
import ScannerQR from '../ScannerQR/ScannerQR';
import { CargarCombustible } from '../CargarCombustible/CargarCombustible';
import { Inconsistencias } from '../Inconsistencias/Inconsistencias';
import { Usuarios } from '../Usuarios/Usuarios';
import { Posiciones } from '../Posiciones/Posiciones';
import { RegistroDeUsuario } from '../RegistroUsuario/RegistroDeUsuario';
import TareasFinalizadas from '../TareasAsignadas/TareasFinalizadas';






export const Principal = ({ activeMenu }) => {
  const userRole = useSelector((state) => state.user.role); 

  return (
    <div>
      {activeMenu === 'Registro de colectivo' && userRole === 'ADMINISTRADOR' && <RegistroDeColectivo />} 
      {activeMenu === 'Inventario' && (userRole === 'ADMINISTRADOR' || userRole === 'SUPERVISOR' || userRole === 'OPERADOR' ) && <TablaDeInventario userRole={userRole} />}
      {activeMenu === 'Choferes' && (userRole === 'ADMINISTRADOR' || userRole === 'SUPERVISOR') && <TablaDeChoferes/> }  
      {activeMenu === 'Registro proveedor' && userRole === 'ADMINISTRADOR' && <RegistroProveedor/> }
      {activeMenu === 'Pedidos aceptados' && userRole === 'ADMINISTRADOR' && <TablaPedidosAceptados/> }
      {activeMenu === 'Inconsistencias' && userRole === 'ADMINISTRADOR' && <Inconsistencias/> }
      {activeMenu === 'Usuarios' && userRole === 'ADMINISTRADOR' && <Usuarios/> }
      {activeMenu === 'Posiciones' && userRole === 'ADMINISTRADOR' && <Posiciones/> }
      {activeMenu === 'Registro de usuario' && userRole === 'ADMINISTRADOR' && <RegistroDeUsuario/> }
      
      
     
      
      {activeMenu === 'Pedidos' && userRole === 'SUPERVISOR' && <TablaPedidosRealizados/> }  
      {activeMenu === 'Proveedores' && userRole === 'SUPERVISOR' && <TablaDeProveedores/> }  

      {activeMenu === 'Colectivos' && <TablaDeColectivos userRole={userRole} />} 
      {activeMenu === 'Mantenimientos' && <HistorialDeMantenimientos userRole={userRole} />} 

      {activeMenu === 'Asignar tarea' && userRole === 'OPERADOR' &&  <AsignarTareas/> } 
      {activeMenu === 'Tareas asignadas' && userRole === 'OPERADOR' &&  <TareasAsignadas/> } 
      {activeMenu === 'Tareas finalizadas' && userRole === 'OPERADOR' &&  <TareasFinalizadas/> } 
      
      {activeMenu === 'ScannerQR' && userRole === 'OPERADOR' &&  <ScannerQR/> } 

      {activeMenu === 'Metrica bitacora' && userRole === 'GERENTE' &&  <MetricaBitacora/> } 
      {activeMenu === 'Metrica stock' && userRole === 'GERENTE' && <MetricaStock/> } 
      {activeMenu === 'Metrica flota' && userRole === 'GERENTE' && <MetricaFlota/> } 

      {activeMenu === 'Cargar combustible' && <CargarCombustible/> }
      
    </div>
  );
};

export default Principal;

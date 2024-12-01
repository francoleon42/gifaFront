import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Principal from '../../components/Principal/Principal';
import NavBar from '../../components/NavBar/NavBar';

import '../Home/Styles/home.css';


import iconColectivos from '../../assets/icons/autobus.png';
import iconInventario from '../../assets/icons/alt-de-inventario.png';
import iconMantenimiento from '../../assets/icons/mantenimientos.png';
import iconChofer from '../../assets/icons/chofer.png';
import iconPedidoAceptado from '../../assets/icons/pedido-aceptado.png';
import iconPortapales from '../../assets/icons/lista-del-portapapeles.png';
import iconProveeedor from '../../assets/icons/proveedor-alternativo.png';
import iconInconsistencias from '../../assets/icons/inconsistencias.png';
import iconMapa from '../../assets/icons/mapa.png';
import iconUsuarioAdmin from '../../assets/icons/usuario-admin.png';
import iconAgregarUsuario from '../../assets/icons/agregar-usuario.png';
import iconPedidoPendiente from '../../assets/icons/pedidos.png';
import iconTareas from '../../assets/icons/tareas.png';
import iconTareasToDo from '../../assets/icons/tareas-todo.png';
import iconScan from '../../assets/icons/qr.png';
import iconCombustible from '../../assets/icons/combustible.png';
import NavBar2 from '../../components/NavBar/NavBar2';

export const Home = () => {
  const userRole = useSelector((state) => state.user.role);

  const getDefaultMenu = (role) => {
    switch (role) {
      case 'ADMINISTRADOR':
        return 'Posiciones';
      case 'SUPERVISOR':
        return 'Colectivos';
      case 'OPERADOR':
        return 'Asignar tarea';
      case 'GERENTE':
        return 'Metrica bitacora';
      case 'CHOFER':
        return 'Cargar combustible';
      default:
        return 'Home';
    }
  };

  const [activeMenu, setActiveMenu] = useState(getDefaultMenu(userRole));

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };
  


  const menuItems = {
    ADMINISTRADOR: [
      { name: 'Colectivos', icon: iconColectivos },
      { name: 'Inventario', icon: iconInventario },
      { name: 'Mantenimientos', icon: iconMantenimiento },
      { name: 'Choferes', icon: iconChofer },
      { name: 'Pedidos aceptados', icon: iconPedidoAceptado },
      { name: 'Registro de colectivo', icon: iconPortapales },
      { name: 'Registro proveedor', icon: iconProveeedor },
      { name: 'Inconsistencias', icon: iconInconsistencias },
      { name: 'Posiciones', icon: iconMapa },
      { name: 'Usuarios', icon: iconUsuarioAdmin },
      { name: 'Registro de usuario', icon: iconAgregarUsuario },
    ],
    SUPERVISOR: [
      { name: 'Colectivos', icon: iconColectivos },
      { name: 'Inventario', icon: iconInventario },
      { name: 'Choferes', icon: iconChofer },
      { name: 'Pedidos', icon: iconPedidoPendiente },
      { name: 'Proveedores', icon: iconProveeedor },
    ],
    OPERADOR: [
      { name: 'Asignar tarea', icon: iconTareasToDo },
      { name: 'ScannerQR', icon: iconScan },
      { name: 'Tareas asignadas', icon: iconTareas },
      { name: 'Tareas finalizadas', icon: iconTareas },
      
    ],
    GERENTE: [
      { name: 'Metrica bitacora' },
      { name: 'Metrica stock' },
      { name: 'Metrica flota' },
    ],
    CHOFER: [
      { name: 'Cargar combustible', icon: iconCombustible },
    ]
  };

  return (
    <div className="DashboardWrapper">
      <NavBar2 menuItems={menuItems[userRole]} onMenuItemClick={handleMenuClick} isActive= {activeMenu} />
      <div className="MainContent">
        <div className="Sidebar">
          {menuItems[userRole] && menuItems[userRole].map(item => (
            <div
              key={item.name}
              className={`MenuItem ${activeMenu === item.name ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.name)}
            >
              {item.name}
              {item.icon && <img src={item.icon} alt={item.name} className="menu-icon" />}
            </div>
          ))}
        </div>
        <div className="ContentArea">
          <Principal activeMenu={activeMenu} />
        </div>
      </div>
    </div>
  );
};

export default Home;

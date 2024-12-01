import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button, Input } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import avatar from '../../assets/Images/LogoNavBar.jpeg';
import EditUserForm from './EditUserForm'; 
import { habilitarUsuario, inhabilitarUsuario } from "../../services/authService";
import './styles/usuarios.css'; 

const TablaUsuarios = ({ users, token, fetchUsers }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [filas, setFilas] = useState(users);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("TODOS");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 770);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(search.toLowerCase()) &&
      (selectedRole === "TODOS" || user.role === selectedRole)
    );
    setFilas(filteredUsers);
  }, [search, selectedRole, users]);

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = async() => {
    setEditingUser(null);
    await fetchUsers();
  };

  const handleToggleEstado = async (user) => {
    const newState = user.estado === "HABILITADO" ? "INHABILITADO" : "HABILITADO";
    const id = user.id;
    try {
      if (newState === "HABILITADO") {
        await habilitarUsuario(id, token);
      } else {
        await inhabilitarUsuario(id, token);
      }
      setFilas((prevFilas) =>
        prevFilas.map((fila) => (fila.id === id ? { ...fila, estado: newState } : fila))
      );
    } catch (error) {
      alert("Error al cambiar el estado del usuario. Por favor, intente nuevamente.", error);
    }
  };

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "username":
        return (
          <User avatarProps={{ radius: "lg", src: avatar }} name={cellValue}>
            {cellValue}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "estado":
        return (
          <Chip className="capitalize" color={user.estado === "HABILITADO" ? "success" : "danger"} size="sm" variant="flat">
            {user.estado}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip color="primary" content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(user)}>
                <EditIcon />
              </span>
            </Tooltip>
            <Button color={user.estado === "HABILITADO" ? "danger" : "success"} onClick={() => handleToggleEstado(user)}>
              {user.estado === "HABILITADO" ? "Inhabilitar" : "Habilitar"}
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const columns = [
    { uid: "username", name: "Username" },
    { uid: "role", name: "Role" },
    { uid: "estado", name: "Estado" },
    { uid: "actions", name: "Actions" },
  ];

  const roles = ["ADMINISTRADOR", "GERENTE", "SUPERVISOR", "OPERADOR", "CHOFER", "TODOS"];

  return (
    <>
      {editingUser ? (
        <EditUserForm user={editingUser} onSave={handleSave} onCancel={() => setEditingUser(null)} token={token} />
      ) : (
        <>
          <div className="filters">
            <Input
              clearable
              bordered
              placeholder="Buscar por nombre"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="searchInput"
            />
            <div className="roleButtons">
              {roles.map((role) => (
                <Button
                  key={role}
                  bordered
                  color={selectedRole === role ? "primary" : "default"}
                  onClick={() => setSelectedRole(role === "TODOS" ? "TODOS" : role)}
                  className={`roleButton ${selectedRole === role ? "active" : ""}`}
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
          {filas.length === 0 ? (
            <div className="NoDataMessage">No hay datos disponibles</div>
          ) : isMobile ? (
            <div className="CardContainer">
              {filas.map((user) => (
                <div key={user.id} className="Card">
                  <div className="CardItem">
                    <span className="CardLabel">Nombre:</span>
                    <span className="CardValue">{user.username}</span>
                  </div>
                  <div className="CardItem">
                    <span className="CardLabel">Rol:</span>
                    <span className="CardValue">{user.role}</span>
                  </div>
                  <div className="CardItem">
                    <span className="CardLabel">Estado:</span>
                    <Chip className="capitalize" color={user.estado === "HABILITADO" ? "success" : "danger"} size="sm" variant="flat">
                      {user.estado}
                    </Chip>
                  </div>
                  <div className="actions">
                    <Button color={user.estado === "HABILITADO" ? "danger" : "success"} onClick={() => handleToggleEstado(user)}>
                      {user.estado === "HABILITADO" ? "Inhabilitar" : "Habilitar"}
                    </Button>
                    <Tooltip color="primary" content="Edit user">
                      <span className="text-lg relative flex items-center pl-2" onClick={() => handleEdit(user)}>
                        <EditIcon />
                      </span>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="TableContainer">
              <Table aria-label="Tabla de Usuarios">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={filas}>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TablaUsuarios;

import React, { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, DropdownMenu, DropdownItem, DropdownTrigger, Dropdown, Avatar } from "@nextui-org/react";
import { NavBarLogo } from "../functions/NavBarLogo";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/authService";
import { clearUser } from "../store/userSlice";
import "./styles/navbar.css";

export default function NavBar2({ menuItems, onMenuItemClick }) {
  const { username, role, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      await logout(token);
      dispatch(clearUser());
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  


  const handleItemClick = (itemName) => {
    onMenuItemClick(itemName);
    setIsMenuOpen(false);
  };

  return (
    <Navbar className="navbar" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label="Toggle menu"
          className="sm:hidden navbar-menu-toggle"
          onChange={() => setIsMenuOpen(!isMenuOpen)} 
        />
        <NavbarBrand>
          <NavBarLogo />
          <p className="font-bold text-inherit size-auto">GIFA</p>
        </NavbarBrand>
      </NavbarContent>

     

      <NavbarContent as="div"  justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="avatar transition-transform"
              color="secondary"
              name={username || "User"}
              size="md"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            className="dropdown-menu"
          >
            <DropdownItem key="profile" className="h-14 gap-2 dropdown-item">
              <p className="text-sm">Nombre: {username || "No User"}</p>
              <p className="text-sm">Role: {role || "No Role"}</p>
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              onClick={handleLogOut}
              className="dropdown-item"
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu className="navbar-menu">
        {menuItems && menuItems.map((item, index) => (
          <NavbarMenuItem className="menu-item" key={index}>
            <Link 
              onClick={() => handleItemClick(item.name)} 
              color="secondary" 
              size="lg"
              className="menu-link"
            >
              {item.name}
              {item.icon && <img src={item.icon} alt={item.name} className="menu-icon" />}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

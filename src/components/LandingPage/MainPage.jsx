import React from 'react';
import { Button } from '@mui/material';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Images/LogoNavBar.jpeg';


const MainPage = () => {
    const navigate = useNavigate();

    const handleIniciarSesion = () => {
        navigate('/login');
    };

    return (
        <div className="main-container">
            <header className="header">
                <Button variant="contained" color="primary" onClick={handleIniciarSesion}>Iniciar Sesión</Button>
            </header>

            <div className="content-wrapper">
                <div className="welcome-card">
                    <img className="logo" src={logo} alt="Flota de Colectivos" />
                    <h1 className="title">Bienvenido al Sistema de Gestión de Flota</h1>
                    <p className="description">
                        Gestiona y controla la flota de colectivos, mantén un seguimiento de los vehículos, mantenimiento, inventario y más.
                    </p>
                </div>
                <section className="info-section">
                    <div className="info-item">
                        <h2>¿Quiénes somos?</h2>
                        <p>
                            Somos un equipo dedicado a mejorar la gestión de flotas de transporte. Nuestra misión es optimizar la operación de colectivos a través de soluciones tecnológicas innovadoras.
                        </p>
                    </div>

                    <div className="info-item">
                        <h2>¿Qué hacemos?</h2>
                        <p>
                            Desarrollamos herramientas de gestión de flotas, mantenimiento, inventarios y control de combustible, todo en un solo lugar para una administración más eficiente.
                        </p>
                    </div>

                    <h2>Conoce Nuestro Sistema</h2>
                    <p>Descubre las funcionalidades y ventajas de nuestro sistema de gestión de flotas con el siguiente video.</p>

                    <div className="video-container">
                        <iframe
                            src="https://mega.nz/embed/Zq0wWQCD#JdxdogvcXNLjTjVi48kwmklcmU5d0N1biKH5Q2m_Sg0"
                            width="480"
                            height="480"
                            allow="autoplay; fullscreen"
                            allowfullscreen
                        ></iframe>
                    </div>
                </section>



            </div>

            <footer className="footer">
                <p>&copy; 2024 ITlab - Todos los derechos reservados</p>
            </footer>
        </div>
    );
};

export default MainPage;

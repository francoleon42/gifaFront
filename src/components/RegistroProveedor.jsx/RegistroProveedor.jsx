import React, { useState } from 'react';
import '../RegistroDeColectivo/styles/RegistroDeColectivo.css'
import { useSelector } from 'react-redux';
import { showsuccessAlert } from '../SweetAlert/SweetAlertSucces';
import { showErrorAlert } from '../SweetAlert/SweetAlertError';
import { registrarProveedor } from '../../services/proveedoresYPedidosController';

export const RegistroProveedor = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
    });


    const token = useSelector((state) => state.user.token);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateFormData = () => {
        const { nombre, email } = formData;

        const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!mailRegex.test(email)) {
            alert("Formato de email inválido");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFormData()) {
            return;
        }

        const dataToSubmit = {
            nombre: formData.nombre.toUpperCase(),
            email: formData.email,
        };

        try {
            const response = await registrarProveedor(dataToSubmit, token);
            setFormData({
                nombre: '',
                mail: '',
            });

            showsuccessAlert('¡Registro exitoso del proveedor!', 'El Proveedor fue agregado correctamente');
        } catch (error) {
            showErrorAlert('Error al registrar un proveedor', error);
        }
    };

    return (
        <div className="container">
            <h2>Registro de Proveedor</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label">
                        Nombre:
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre || ""}  
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="label">
                        Mail:
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </label>
                </div>
                <button type="submit" className="button">Registrar Proveedor</button>
            </form>

        </div>
    );
};

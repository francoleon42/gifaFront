import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { showsuccessAlert } from '../SweetAlert/SweetAlertSucces';
import { showErrorAlert } from '../SweetAlert/SweetAlertError';
import {register} from '../../services/authService'

export const RegistroDeUsuario = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: '', 
    });

    const token = useSelector((state) => state.user.token);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();


        const dataToSubmit = {
            username: formData.username,
            password: formData.password,
            role: formData.role, 
        };

        try {
            const response = await register(dataToSubmit, token);
            setFormData({
                username: '',
                password: '',
                role: '',
            });

            showsuccessAlert('¡Registro exitoso de usuario!', 'El usuario fue agregado correctamente');
        } catch (error) {
            showErrorAlert('Error al registrar el usuario', error);
        }
    };

    return (
        <div className="container">
            <h2>Registro de usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label">
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username || ""}  
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="label">
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password || ""}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="label">
                        Role:
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="input-field"
                        >
                            <option value="">Seleccione un rol</option>
                            <option value="GERENTE">Gerente</option>
                            <option value="SUPERVISOR">Supervisor</option>
                            <option value="OPERADOR">Operador</option>
                            <option value="ADMINISTRADOR">Administrador</option>
                        </select>
                    </label>
                </div>
                <button type="submit" className="button">Registrar usuario</button>
            </form>
        </div>
    );
};

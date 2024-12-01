import { verProveedores } from "../../services/proveedoresYPedidosController";

export const fetchProveedores = async (setProveedores, token) => {
    try {
        const response = await verProveedores(token);
        const proveedoresDisponibles = response.map((response) => ({
                key: response.id,
                id: response.id, 
                nombre: response.nombre,
            }));
            setProveedores(proveedoresDisponibles);
    } catch (error) {
        console.error("Error fetching proveedores: ", error);
    }
};

export default fetchProveedores;

import { backendUrl } from "../connection/backUrl";
import { executeFetch } from "../connection/fetch";
import { HttpMethods } from "../connection/HttpMethods";

/*
public class RegistrarMantenimientoDTO {
    private String asunto;
    private Integer vehiculo_id;
}
*/
export const cargarMantenimientoManual = async (data, token) => {
    const endpoint = backendUrl + '/mantenimiento/crearManual';
    return await executeFetch(endpoint, data, HttpMethods.POST, token, 201);
};

export const verMantenimientoPorVehiculo = async (id, token) => {
    const endpoint = backendUrl + '/mantenimiento/porVehiculo/' + id;
    return await executeFetch(endpoint, null, HttpMethods.GET, token, 200);
};

export const verMantenimientos = async (token) => {
    const endpoint = backendUrl + '/mantenimiento/finalizados';
    return await executeFetch(endpoint, null, HttpMethods.GET, token, 200);
};

export const verMantenimientosPendientes = async (token) => {
    const endpoint = backendUrl + '/mantenimiento/pendientes';
    return await executeFetch(endpoint, null, HttpMethods.GET, token, 200);
};

export const asignarMantenimiento = async (id, token) => {
    const endpoint = backendUrl + '/mantenimiento/asignar/' + id;
    return await executeFetch(endpoint, null, HttpMethods.POST, token, 200);
};

/*
public class FinalizarMantenimientoDTO {
    List<ItemUtilizadoRequestDTO> items;
}
public class ItemUtilizadoRequestDTO {
    Integer idItem;
    Integer cantidad;
}
*/
export const finalizarMantenimiento = async (id, data, token) => {
    const endpoint = backendUrl + '/mantenimiento/finalizar/' + id;
    return await executeFetch(endpoint, data, HttpMethods.POST, token, 200);
};

export const verMisMantenimientos = async (token) => {
    const endpoint = backendUrl + '/mantenimiento/verMisMantenimientos';
    return await executeFetch(endpoint, null, HttpMethods.GET, token, 200);
};
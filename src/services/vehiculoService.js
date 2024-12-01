import { backendUrl } from "../connection/backUrl";
import { executeFetch } from "../connection/fetch";
import { HttpMethods } from "../connection/HttpMethods";

export const verVehiculos = async (token) => {
    const endpoint = backendUrl + '/vehiculo/verAll';
    return await executeFetch(endpoint, null, HttpMethods.GET, token, 200);
};

/*
public class RegistarVehiculoDTO {
    private String patente;
    private Integer antiguedad;
    private Integer kilometraje;
    private Integer litrosDeTanque;
    private String modelo;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate fechaRevision;
}
*/
export const registrar = async (data, token) => {
    const endpoint = backendUrl + '/vehiculo/registrar';
    return await executeFetch(endpoint, data, HttpMethods.POST, token, 201);
};

export const inhabilitar = async (id, token) => {
    const endpoint = backendUrl + '/vehiculo/inhabilitar/' + id;
    return await executeFetch(endpoint, null, HttpMethods.PATCH, token, 200);
};

export const habilitar = async (id, token) => {
    const endpoint = backendUrl + '/vehiculo/habilitar/' + id;
    return await executeFetch(endpoint, null, HttpMethods.PATCH, token, 200);
};
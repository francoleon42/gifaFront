import { backendUrl } from '../connection/backUrl';
import {executeFetch} from '../connection/fetch'
import {HttpMethods} from '../connection/HttpMethods'

export const crearDispositivo = async (data, token) => {
    const endpoint = backendUrl + '/traccar/crearDispositivo';
    return await executeFetch(endpoint, data, HttpMethods.POST, token, 200);
};

export const verDispositivos = async (token) => {
    const endpoint = backendUrl + '/traccar/getDispositivos';
    return await executeFetch(endpoint, null, HttpMethods.GET, token, 200);
};

export const verInconsistencias = async (from, to, token) => {
    const endpoint = `${backendUrl}/traccar/verInconsistenciasDeCombustible?from=${from}&to=${to}`;
    return await executeFetch(endpoint, null, HttpMethods.GET, token, 200);
};



export const verPosiciones = async (id, token) => {
    const endpoint = backendUrl + '/traccar/getPosicionesEnVivo/' + id;
    return await executeFetch(endpoint, null, HttpMethods.GET, token, 200);
};

export const verPosicionesEnFechas = async (id, token, fechaInicio, fechaFin) => {
    const endpoint = `${backendUrl}/traccar/getPosicionesEnRangoDeFechas/${id}?from=${fechaInicio}&to=${fechaFin}`;
    return await executeFetch(endpoint, null, HttpMethods.GET, token, 200);
};

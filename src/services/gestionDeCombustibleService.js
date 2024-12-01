import { backendUrl } from '../connection/backUrl';
import {executeFetch} from '../connection/fetch'
import {HttpMethods} from '../connection/HttpMethods'


/*
public class CargaCombustibleRequestDTO {
     Integer cantidadLitros;
     Integer tarjetaId;
}
*/
export const cargarCombustible = async (data, token) => {
    const endpoint = backendUrl + '/gestionDeCombustible/cargarCombustible';
    return await executeFetch(endpoint, data, HttpMethods.POST, token, 201);
};
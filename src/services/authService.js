import { backendUrl } from '../connection/backUrl';
import {executeFetch} from '../connection/fetch'
import {HttpMethods} from '../connection/HttpMethods'

/*
public class LoginRequestDTO {
    private String username;
    private String password;
}
*/
export const login = async (data) => {
    const endpoint = backendUrl + '/auth/login';
    return await executeFetch(endpoint, data, HttpMethods.POST, null, 200);
};

/*
public class RegisterRequestDTO {
    private String username;
    private String password;
    private String role;
}
*/ 
export const register = async (data, token) => {
    const endpoint = backendUrl + '/auth/register';
    return await executeFetch(endpoint, data, HttpMethods.POST, token, 201);
};

export const logout = async (token) => {
    const endpoint = backendUrl + '/auth/logout';
    return await executeFetch(endpoint, null, HttpMethods.POST, token, 200);
};


export const verAllUsers = async (token) => {
    const endpoint = backendUrl + '/auth/getAllUsers';
    return await executeFetch(endpoint, null, HttpMethods.GET, token, 200);
};

export const updateUser = async (data,id,token) => {
    const endpoint = backendUrl + '/auth/update/'+ id;
    return await executeFetch(endpoint, data, HttpMethods.PUT, token, 201);
};


export const habilitarUsuario = async (id, token) => { 
    const endpoint = backendUrl + '/auth/habilitar/' + id;
    return await executeFetch(endpoint, null, HttpMethods.PATCH, token, 200);
};


export const inhabilitarUsuario = async (id, token) => { 
    const endpoint = backendUrl + '/auth/inhabilitar/' + id;
    return await executeFetch(endpoint, null, HttpMethods.PATCH, token, 200);
};
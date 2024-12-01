import { HttpMethods, findHttpMethod } from "./HttpMethods";

const validateEndpoint = (endpoint) => {
    if (typeof endpoint !== 'string' || !endpoint.trim()) {
        throw new Error('La URL del endpoint es inválida');
    }
};

const validateMethod = (method) => {
    const httpMethod = findHttpMethod(method);
    if (!httpMethod) {
        throw new Error('Método HTTP inválido');
    }
    return httpMethod;
};

const getFetchOptions = (method, data, token) => {
    const options = {
        method: method,
        headers: {
        'Content-Type': 'application/json',
        },
    };

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === HttpMethods.POST || method === HttpMethods.PUT || method === HttpMethods.PATCH)) {
        options.body = JSON.stringify(data);
    }

    return options;
};

const handleResponse = async (response, statusExpected) => {
    const status = response.status

    if (status !== statusExpected) {
        try {
            const errorData = await response.json();

            if (errorData.message) {
                throw new Error(`Error en la solicitud: ${errorData.message}`);
            }
        } catch (e) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return null;
    }

    return await response.json();
};

/*
Ejemplo de ejecución: 
executeFetch('https://api.example.com/1', { key: 'value' }, HttpMethods.POST, 201)
.then(data => console.log(data))
.catch(error => console.error(error));
*/
export const executeFetch = async (endpoint, data = null, method, token = null, statusExpected) => {
    try {
        validateEndpoint(endpoint);
        const httpMethod = validateMethod(method);

        const options = getFetchOptions(httpMethod, data, token);

        const response = await fetch(endpoint, options);

        return await handleResponse(response, statusExpected);
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};
import { backendUrl } from "../connection/backUrl";
import { executeFetch } from "../connection/fetch";
import { HttpMethods } from "../connection/HttpMethods";

export const getMetabaseToken = async (id, token) => {
    const endpoint = backendUrl  + '/metabase/token?dashboardId=' + id;
    return await executeFetch(endpoint, null, HttpMethods.GET, token, 200);
};
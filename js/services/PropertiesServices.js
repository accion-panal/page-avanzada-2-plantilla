import api from "./AuthencationServices.js"

export const getProperties = async (page, limit, CodigoUsuarioMaestro, statusId, companyId, realtorId) => {
    let { data } = await api.get(`properties?page=${page}&limit=${limit}&CodigoUsuarioMaestro=${CodigoUsuarioMaestro}&realtorId=${realtorId}&statusId=${statusId}&companyId=${companyId}`);
    console.log('getProperties: ', data);
    return data;
}


export const getPropertiesForId = async (id, statusId, companyId) => {
    let data = await api.get(`properties/${id}?&statusId=${statusId}&companyId=${companyId}`);
    return data;
}

//* Filtros
export const getPropertiesForCustomUrl = async (page, limit, CodigoUsuarioMaestro, statusId, companyId, realtorId, urlFilters) => {
    const response = await api.get(`properties?page=${page}&limit=${limit}&CodigoUsuarioMaestro=${CodigoUsuarioMaestro}&realtorId=${realtorId}&statusId=${statusId}&companyId=${companyId}${urlFilters}`);
    console.log('getResponse: ', response)
    return response.data;
}

//* Paginado
export const getPagination = async (urlFilters) => {
    const response = await api.get(`properties?${urlFilters}`);
    console.log('getPaginado: ', response)
    return response.data;
}


export const getRegiones = async () => {
    let data = await api.get(`properties/select-filters`);
    return data;
}


export const getCommune = async (id) => {
    let data = await api.get(`properties/communes?stateId=${id}`);
    return data;
}
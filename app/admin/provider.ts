import { DataProvider, fetchUtils } from "react-admin";


const API_URL = "http://localhost:8080/api/v1"
const httpClient = fetchUtils.fetchJson

export const dataProvider: DataProvider = {
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const response = await httpClient(`${API_URL}/${resource}?_page=${page}&_limit=${perPage}&_order=${order}`)

        const { data } = await response.json
        const transformedData = data.map((item : any) => ({
            id: item._id,  
            ...item
        }));

        return {
            data: transformedData,
            total: parseInt(response.headers.get('x-total-count') || "", 10)
        }

    },

    getMany: async (resource, params : any) => {
        const query = {
            filter: JSON.stringify({ ids: params.ids }),
        };

        const url = `${API_URL}/${resource}?${String(query)}`;
        const response = await httpClient(url, { signal: params.signal });

        const {data} = await response.json;

        const transformedData = data.map((item : any) => ({
            id: item._id,  
            ...item
        }));
        
        return { data: transformedData };
    },

    getOne: async (resource, params) => {

        const response = await httpClient(`${API_URL}/${resource}/${params.id}`,  {
            method : 'GET',
        })

        const {data}  = await response.json

        return {
            data : {id : data._id, ...data}
        } 
    },

    create: async (resource, params) => {

        const fromData = params.data

        const response = await httpClient(`${API_URL}/${resource}/create`, {
            method: 'POST',
            body: JSON.stringify(fromData)
        })

        const data = await response.json;

        return {
            data : {id : data._id, ...data}
        }
    },
    
    update: async (resource, params) => {

        const fromData = params.data

        const response = await httpClient(`${API_URL}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(fromData)
        })

        const data = await response.json;

        return {
            data : {id : data._id, }
        }

    }, 

    delete : async (resource, params) => {

        const response = await httpClient(`${API_URL}/${resource}/${params.id}`, {
            method : 'DELETE',
        })

        const data = await response.json;

        return {
            data : {id : data._id, ...data}
        }
    }



   
}




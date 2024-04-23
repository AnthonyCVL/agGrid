import {variables} from "../utils/variables";

const getquerydata = async (body) => {
    const base_url = variables.API_URL
    const method = '/getQueryData'
    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    };
    return await send_post(base_url, method, request)
}

const send_post = async (base_url, method, request) => {
    const response = await fetch(base_url + method, request);
    return await response.json()
    /*if (){

    }else{
        const response = await fetch(base_url + method, request)
        return await response.json()
    }*/
}




//Maintenance
const makeRequest = (method) => async (body) => {
    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    };
    const response = await fetch(variables.API_URL + method, request);
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Error in request');
    }
}

const makeRequestStatus = (method) => async (body) => {
    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    };
    return await fetch(variables.API_URL + method, request);
}

const request_getquerydata = makeRequest( '/getQueryData');
const request_getquerycolumns = makeRequest('/getQueryColumns');
const request_insertrow = makeRequestStatus('/insertRow');
const request_updaterow = makeRequestStatus('/updateRow');
const request_deleterow = makeRequestStatus('/deleteRow');



const ApiService = {
    getquerydata,
    request_getquerydata,
    request_getquerycolumns,
    request_insertrow,
    request_updaterow,
    request_deleterow
};

export default ApiService;
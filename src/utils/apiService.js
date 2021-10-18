import Axios from "axios";

let config = {
    baseURL: 'http://apps01.forteinnovation.mx:8590/api',
    headers: {
        'accept': 'text/plain',
        'content-type': 'application/json'
    }
};

const ApiService = {
    setHeader(type, value) {
        config.headers[type] = value;
    },
    get(resource) {
        return Axios.get(resource, config);
    },
    post(resource, data) {
        return Axios.post(resource, data, config);
    },
    put(resource, data) {
        return Axios.put(resource, data, config);
    },
    delete(resource) {
        return Axios.delete(resource, config);
    },
    customRequest(data) {
        return Axios(data)
    }
}

export default ApiService;
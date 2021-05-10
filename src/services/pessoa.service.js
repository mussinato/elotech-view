import http from "../http-common";

const getAll = (offset, limit) => {
    return http.get(`/pessoas?offset=${offset}&limit=${limit}`);
}

const get = id => {
    return http.get(`/pessoas/${id}`);
}

const create = data => {
    return http.post("/pessoas",data);
}

const update = (id,data) => {
    return http.put(`/pessoas/${id}`,data);
}

const remove = id => {
    return http.delete(`/pessoas/${id}`);
}


const PessoaService = {
    getAll,
    get,
    create,
    update,
    remove
}

export default PessoaService;
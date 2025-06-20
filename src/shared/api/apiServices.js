import {http} from './httpClient.js';

export class ApiService {
    constructor(resource) {
        this.resource = resource; // ej: 'users', 'products'
    }

    getAll(params) {
        return http.get(`/${this.resource}`, { params });
    }

    getById(id) {
        return http.get(`/${this.resource}/${id}`);
    }

    create(data) {
        return http.post(`/${this.resource}`, data);
    }

    update(id, data) {
        return http.put(`/${this.resource}/${id}`, data);
    }

    remove(id) {
        return http.delete(`/${this.resource}/${id}`);
    }
}
import { ApiService } from "@shared/api/apiServices.js";

export class UserService extends ApiService {
    constructor() {
        super('users');
    }
}

export const userService = new UserService();
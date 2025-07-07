import { ApiService } from "@shared/api/apiServices.js";

export class UserService extends ApiService {
    constructor() {
        super('user-account');
    }
}

export const userService = new UserService();

export class ActualUserService extends ApiService {
    constructor() {
        super('authorization/sign-in');
    }
}
import { DsHttpClient } from './http';
import { UserApi } from './api';
import { UserService } from './services';
export const dsHttpClient = new DsHttpClient();

export const userApi = new UserApi(dsHttpClient);
export const userService = new UserService(userApi);
import { UserApi } from '../../api';
import { AxiosRequestConfig } from 'axios';

export class UserService {

  constructor(private userApi: UserApi) { }

  /**
   * 获取所有用户
   */
  getAllUsers(options?: AxiosRequestConfig) {
    return this.userApi.getAllUsers(options);
  }


}

import { DsHttpClient } from '../../http/ds-http-client';
import { AxiosRequestConfig } from 'axios';
import { HOST_URL } from '../url';
export class UserApi {

  constructor(private dsHttp: DsHttpClient) { }

  /**
   * 获取所有用户
   */
  getAllUsers(options?: AxiosRequestConfig) {
    const url = `${HOST_URL}/users`;
    return this.dsHttp.dsGet(url, options);
  }

}


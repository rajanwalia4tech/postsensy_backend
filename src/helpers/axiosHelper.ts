import axios from 'axios';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AxiosHelper {
  constructor() {}
  
  async axiosPOSTHelper(
    data: any,
    url: string,
    headers: any,
    vendor: string,
    userId?: string,
    type?: string,
  ) {
    let res = null;
    let logResponse = null;
    await axios
      .post(url, data, { headers })
      .then((response: any) => {
        res = response.data;
        logResponse = response.data;
      })
      .catch((error: { response: { data: any } }) => {
        logResponse = error?.response?.data;
      });

    // if (vendor !== 'internal') {
    //   this.logService.create({
    //     userId,
    //     type,
    //     status: res ? 'success' : 'error',
    //     vendor,
    //     request: {
    //       url: url,
    //       requestBody: data,
    //       requestHeaders: headers,
    //     },
    //     response: logResponse,
    //   });
    // }
    return res;
  }

  async axiosPUTHelper(url: string, headers: any, data: any) {
    let res = null;
    await axios
      .put(url, data, { headers })
      .then((response: any) => {
        res = response.data;
      })
      .catch((error: { response: { data: any } }) => {
        console.log(error.response.data);
      });
    return res;
  }

  async axiosGETHelper(url: string, headers: any) {
    let data;
    await axios
      .get(url, { headers })
      .then((response: any) => {
        data = response.data;
      })
      .catch((error: Error) => {
        throw error;
      });
    return data;
  }
}

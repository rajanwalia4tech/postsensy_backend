import axios from 'axios';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AxiosHelper {
  constructor() {}
  
  async post(
    url: string,
    data: any,
    config: any, // like headers, params
    vendor?: string,
    userId?: string,
    type?: string,
  ) {
    let res = null;

    try{
      const response = await axios.post(url, data, config);
      res = response.data;
      console.log(url, " ---> ",res);
      return res;
    }catch(error){
      console.error("Error ---> ", url,"\n\n", error?.response?.data);
      throw error?.response?.data;
    }
  }

  async put(url: string, config: any) {
    let res = null;
    try{
      const response = await axios.get(url, config);
      res = response.data;
      console.log(url, " ---> ",res);
      return res;
    }catch(error){
      console.error("Error ---> ", url,"\n\n", error?.response?.data);
      throw error?.response?.data;
    }
  }

  async get(url: string, config: any) {
    let res;
    try{
      const response = await axios.get(url, config);
      res = response.data;
      console.log(url, " ---> ",res);
      return res;
    }catch(error){
      console.error("Error ---> ", url,"\n\n", error?.response?.data);
      throw error?.response?.data;
    }
  }
}

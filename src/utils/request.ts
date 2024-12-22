import axios, {
  AxiosInstance,
  AxiosResponse ,
  AxiosError,
  AxiosRequestConfig,
  HttpStatusCode
} from 'axios';

import { message } from 'antd';
import { getLocale } from '@umijs/max';
import localforage from 'localforage';

const request: AxiosInstance = axios.create(<{
  baseURL: any
  timeout: number
  headers: any
}>{
  baseURL: process.env.BaseUrl,
  timeout: 60000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
request.interceptors.request.use(async (config: AxiosRequestConfig) => {

  const accessToken = await localforage.getItem('access_token');

  if(getLocale()){
    config.headers['Accept-Language'] = getLocale();
  }

  if(accessToken && config && config?.headers){
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  //删除属性值 为空 或者 undefined
  if(config.data){
    Object.keys(config.data).forEach((val: string) => {
      if( config.data[val] === null || config.data[val] === undefined){
        delete config.data[val]
      }
    });
  }

  return config;

},  (error: AxiosError) => {
  // Do something with request error
  return Promise.reject(error);
});


// Add a response interceptor
request.interceptors.response.use( (response: AxiosResponse) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  if(response.status === HttpStatusCode.Ok){
    return response.data;
  }

  return Promise.reject(response?.data);

},  (error: AxiosError) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  if(error?.response?.status === HttpStatusCode.BadRequest){
    const responseData: any = error?.response?.data;
    message.error(responseData.message);
  }

  return Promise.reject(error);
});

export default request;




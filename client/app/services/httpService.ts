import axios from 'axios';
import { SERVER_URL } from '../../config/api';

// Configurar axios com URL base
axios.defaults.baseURL = SERVER_URL;

const service = {
  get: (url: string) => {
    return axios.get(url);
  },

  post: (url: string, json: any) => {
    return axios.post(url, json); 
  },
};

export default service;

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://app.silup.com.br/api',
});

export default api;

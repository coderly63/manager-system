import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 3000,
})
instance.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.token;
  // console.log(config);
  return config;
}, err => {
  console.log(err);
})
export default instance
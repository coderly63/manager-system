import axios from 'axios'

//导入进度条
import NProcess from 'nprogress'
import 'nprogress/nprogress.css'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 3000,
})
instance.interceptors.request.use(config => {
  NProcess.start();
  config.headers.Authorization = window.sessionStorage.token;
  // console.log(config);
  return config;
}, err => {
  console.log(err);
})
instance.interceptors.response.use(config => {
  NProcess.done();
  return config
})
export default instance
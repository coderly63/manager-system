import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 3000,
})
export default instance
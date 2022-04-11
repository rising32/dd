import axios from 'axios';

const host = process.env.REACT_APP_API_HOST;
const apiClient = axios.create({
  baseURL: host,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});

export default apiClient;

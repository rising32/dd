import { useState, useEffect, useRef } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});

const useAxiosPost = (url: string, payload: any) => {
  const [response, setResponse] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError>();
  const [loaded, setLoaded] = useState(false);
  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  };

  useEffect(() => {
    apiClient
      .post(url, payload)
      .then(response => setResponse(response.data))
      .catch(error => setError(error.message))
      .finally(() => setLoaded(true));
  }, []);

  return { response, error, loaded, cancel };
};

export default useAxiosPost;

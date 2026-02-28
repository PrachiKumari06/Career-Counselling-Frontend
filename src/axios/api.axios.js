import axios from "axios";

const Axios = axios.create({
 baseURL: `${import.meta.env.VITE_API_URL}/api`,
  //  baseurl:"http://localhost:4000/api"    //this is when i did localhost in my browser
  // baseURL: "http://192.168.1.8:Port of backend/api",  //whene run on phone and desktop both 
});

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default Axios;

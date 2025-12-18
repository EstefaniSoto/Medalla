import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7212/api",
  
});

export default axiosClient;

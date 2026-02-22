import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://190.166.237.107/Medalla_Al_Merito_Api/api/",
  
});

export default axiosClient;

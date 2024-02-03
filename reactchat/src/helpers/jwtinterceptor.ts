import axios, { AxiosInstance } from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { useAuthService } from "../services/AuthServices";

const API_BASE_URL = BASE_URL;

const useAxiosWithInterceptor = (): AxiosInstance => {
  const { logout } = useAuthService();
  const jwtAxios = axios.create({ baseURL: API_BASE_URL });
  const navigate = useNavigate();

  jwtAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 || error.response?.status === 403) {
        axios.defaults.withCredentials = true;
        try {
          const response = await axios.post(`${BASE_URL}/token/refresh/`);
          if (response["status"] === 200) {
            return jwtAxios(originalRequest);
          }
        } catch (refreshError) {
          logout();
          const goLogin = () => navigate("/login");
          goLogin();
          throw Promise.reject(refreshError);
        }
      }
      throw error;
    }
  );
  return jwtAxios;
};

export default useAxiosWithInterceptor;

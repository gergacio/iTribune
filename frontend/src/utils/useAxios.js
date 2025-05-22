import axios from "axios";
import { getRefreshedToken, isAccessTokenExpire, setAuthUser } from './auth';
import { API_BASE_URL } from "./constants";
import Cookie from "js-cookie";

const useAxios = () => {
    const accessToken = Cookie.get('access_token');
    const refreshToken = Cookie.get('refresh_token');

    // when make call to private route add accessToken for authorisation
    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer: ${accessToken}` }
    });
    axiosInstance.interceptors.request.use(async (req) => {
        if (!isAccessTokenExpire) {
            return req;
        }
        const response = await getRefreshedToken((refreshToken));
        setAuthUser(response.access, response.refresh);
        req.headers.Authorization = `Bearer ${response.data?.access}`;
        return req;


    });
  
    return axiosInstance;

};

export default useAxios;
import { useAuthStore } from '../store/auth.js';
import axios from "./axios.js";
import jwt_decode from "jwt-decode";
import Cookie from "js-cookie";
import Swal from "sweetalert2";

//func handle user login
export const login = async(email, password) => { 
    try {
        // make post request back to API (endpoint - user/token, axios take care of base url )with user email and password 
        //get access , get token saved into cookie
        const { data, status } = await axios.post(`/user/token`, { email, password });
        
        if (status === 2000) { 
            setAuthUser(data.access, data.refresh); // set data to the cookie
           
        }
        return {data, error: null}



    } catch (error) { 
        return {
            data: null,
            error: error.response.data?.detail || "Something went wrong"
        }
    }
}

// func to get register the user
// use endpoint user/register

export const register = async(full_name, email, password, password2) => { 
    try {
        const { data } = await axios.post(`/user/register/`,
            { full_name, email, password, password2 }); // {full_name, email} data send back 
     
        await login(email, password); // if want to login after register
        
        return {data, error: null}
  

    } catch (error) { 
      
        
        return {
            data: null,
            error: `${error.response.data.full_name} - ${error.response.data.email}` || "Something went wrong"
        }
    }

}

export const logout = async () => {
    //when user log out clear the cookie
    Cookie.remove("access_token");
    Cookie.remove("refresh_token");
    useAuthStore.getState().setUser(null) //set user as null

    alert("You have been logged out")
};

//func to set the user
export const setUser = async () => { 
    const access_token = Cookie.get("access_token"); 
    const refresh_token = Cookie.get("refresh_token"); 

    if (!access_token || !refresh_token) {
       // alert("Tokens does not exist")
        return;

    }
    if (isAccessTokenExpired(access_token)) {
        const response = getRefreshedToken(refresh_token);
        setAuthUser(response.access, response.refresh);
    } else { 
         setAuthUser(access_token, refresh_token);
    }

}

export const setAuthUser = (access_token, refresh_token) => { 
    //set authentication user means set data to the cookie 
    Cookie.set("access_token", access_token, {
        expires: 1,
        secure: true,
        
    });// "access_token" is the key"
    Cookie.set("refresh_token", refresh_token, {
        expires: 7,
        secure: true,
        
    });

    const user = jwt_decode(access_token) ?? null;

    if (user) {
        useAuthStore.getState().setUser(user);
    } 
    useAuthStore.getState().setLoading(false);
    

} 

const isAccessTokenExpired = (access_token) => { 
    try {
        const decodedToken = jwt_decode(access_token);
        return decodedToken.exp < Date.now() / 1000;
    } catch (error) { 
        console.log(error)
        return true;
    }

}

  


export const getRefreshedToken = async () => { 
    //retrieve refresh token from the cookie, do post request
    const refresh_token = Cookie.get("refresh_token");   // refresh_token is a key that save refresh token to the cookie
    const response = await axios.post(`/token/refresh/`, {
        refresh: refresh_token, //pass refresh_token get it from the cookie
    });

    return response.data;

}
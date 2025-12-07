import { LoginEndpoint } from "../api/APIEndpoints";
import axios from "axios";
async function LoginService({username, password}) {
    userData=JSON.stringify({username, password});
    const response = await axios.post(LoginEndpoint, userData, {
        headers:{
            'Content-Type': 'application/json'
        }
    });
    const data=response.json();
    if(data.token){
        sessionStorage.setItem("token", data.token);
        Navigate("/dashboard");
        return {success: true};
    }
    else{
        return {error: "Invalid Credentials"};
    }
};
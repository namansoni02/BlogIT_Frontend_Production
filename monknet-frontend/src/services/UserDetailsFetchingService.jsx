import axios from "axios";
import { UserDataEndpoint } from "@/api/APIEndpoints"
export default async function UserDetailsFetching(){
    try{
        const JWT_Token = sessionStorage.getItem("token");
        const data = await axios.get(UserDataEndpoint,{
            headers:{
                "content-type":"application/json",
                Authorization: `Bearer ${JWT_Token}`
            }
        });
        
        // Store user details in sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(data.data));
        
        return data.data;
    }
    catch(error){
        console.error("Error fetching user details:", error);
        return null;
    }
}
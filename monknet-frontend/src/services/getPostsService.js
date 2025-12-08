import {GetAllPostEndpoint} from '../api/APIEndpoints.jsx';
export default async function getPostsService(page = 1) {
    try{
        const JWT_Token = sessionStorage.getItem("token");
        console.log("Fetching posts from:", `${GetAllPostEndpoint}?page=${page}`);
        const response = await fetch(`${GetAllPostEndpoint}?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JWT_Token}`
            }
        });
        
        if (!response.ok) {
            console.error("Failed to fetch posts:", response.status, response.statusText);
            return [];
        }
        
        const data = await response.json();
        console.log("Posts fetched:", data);
        return data.posts || [];
    }
    catch(error){
        console.error("Error fetching posts:", error);
        return [];
    }
}
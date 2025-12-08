import {GetAllPostEndpoint} from '../api/APIEndpoints.jsx';
export default async function getPostsService(page = 1) {
    try{
        const JWT_Token = sessionStorage.getItem("token");
        const response = await fetch(`${GetAllPostEndpoint}?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JWT_Token}`
            }
        });
        const data = await response.json();
        //console.log("Posts fetched:", data.posts);
        return data.posts;
    }
    catch(error){
        console.error("Error fetching posts:", error);
        return [];
    }
}
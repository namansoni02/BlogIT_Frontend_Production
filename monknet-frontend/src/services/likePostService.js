import { LikePostEndpoint } from "@/api/APIEndpoints";

export default async function likePostService(postId, like = true) {
    try {
        const JWT_Token = sessionStorage.getItem("token");
        const url = `${LikePostEndpoint}${postId}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JWT_Token}`
            },
            body:JSON.stringify({ like })
        });

        if (!response.ok) {
            throw new Error(`Error ${like ? 'liking' : 'unliking'} post: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in likePostService:", error);
        throw error;
    }
}
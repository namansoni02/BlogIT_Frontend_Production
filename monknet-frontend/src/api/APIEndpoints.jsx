const BackendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

// Auth related POST APIs
const LoginEndpoint = `${BackendURL}/auth/login`;
const SignUpEndpoint = `${BackendURL}/auth/register`;

//User related APIs
//GET
const UserDataEndpoint = `${BackendURL}/user/userdata`
const UserFollowersDataEndpoint = `${BackendURL}/user/followers`
const UserFollowingsDataEndpoint = `${BackendURL}/user/following`
const UserFollowNotificationataEndpoint = `${BackendURL}/user/follownotifications`
const GetAllUsersEndpoint = `${BackendURL}/user/allusers`
const GetUserByUsernameEndpoint = `${BackendURL}/user` // /:username 
//POST
const FollowUserEndpoint = `${BackendURL}/user/follow` // /follow/:userIdToFollow
const UnfollowUserEndpoint = `${BackendURL}/user/unfollow` // /unfollow/:userIdToUnfollow


// Post Related APIS
//GET
const GetAllPostEndpoint = `${BackendURL}/post/`
//POST
const PostEndpoint = `${BackendURL}/post/`
const LikePostEndpoint = `${BackendURL}/post/like/`   // :PostID
//DELETE
const DeletePostEndpoint = `${BackendURL}/post/delete` // /:PostID



export { LoginEndpoint, SignUpEndpoint , UserDataEndpoint, UserFollowersDataEndpoint, UserFollowingsDataEndpoint, UserFollowNotificationataEndpoint, GetAllUsersEndpoint, GetUserByUsernameEndpoint,
         FollowUserEndpoint, UnfollowUserEndpoint, GetAllPostEndpoint, PostEndpoint, DeletePostEndpoint,LikePostEndpoint};
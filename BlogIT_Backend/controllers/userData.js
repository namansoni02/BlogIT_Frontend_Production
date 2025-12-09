import User from '../models/User.js';
import Post from '../models/Post.js';

const getUserData = async (req, res) => {
    try {
        const user= await User.findById(req.user._id).select('-password');
        const postTitles = await Post.find({author: req.user._id}).select('title _id');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            posts: postTitles,
            stats: {
                followers: user.followers.length,
                following: user.following.length,
                posts: user.postCount,
                likes: user.likes,
                views: user.views
            },
            userBio: user.userBio,
            likedPosts: user.likedPosts
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error'});
    }
};

const getFollowers = async (req, res) => { 
    try {
        const user= await User.findById(req.user._id).select('followers');
        const followerList= user.followers;
        const followerListWithNames = await User.find({_id: { $in: followerList }}).select("username _id");

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json({followers: followerListWithNames});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error'});
    }
};

const getFollowing = async (req, res) => {
    try {
        const user= await User.findById(req.user._id).select('following');
        const followingList= user.following;
        const followingListWithNames = await User.find({_id: { $in: followingList }}).select("username _id");
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json({following: followingListWithNames});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error'});
    }
};

const followUser = async (req, res) => {
    try {
        const { userIdToFollow } = req.params;
        if(req.user._id.toString() === userIdToFollow){
            return res.status(400).json({message: "Cannot follow yourself"});
        }
        const userToFollow = await User.findById(userIdToFollow);
        if(!userToFollow){
            return res.status(404).json({message: "User to follow not found"});
        }
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { following: userIdToFollow }
        });
        await User.findByIdAndUpdate(userIdToFollow, {
            $addToSet: { followers: req.user._id },
            $addToSet: { followNotifications: req.user._id }
        });
        return res.status(200).json({message: "Successfully followed the user"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error'});
    }
};

const unfollowUser = async (req, res) => {
    try {
        const { userIdToUnfollow } = req.params;
        if(req.user._id.toString() === userIdToUnfollow){
            return res.status(400).json({message: "Cannot unfollow yourself"});
        }
        const userToUnfollow = await User.findById(userIdToUnfollow);
        if(!userToUnfollow){
            return res.status(404).json({message: "User to unfollow not found"});
        }
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { following: userIdToUnfollow }
        });
        await User.findByIdAndUpdate(userIdToUnfollow, {
            $pull: { followers: req.user._id }
        });
        return res.status(200).json({message: "Successfully unfollowed the user"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error'});
    }
};

const getFollowNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('followNotifications');
        const notifications = user.followNotifications;
        const notificationDetails = await User.find({_id: { $in: notifications }}).select("username _id");

        // Clear notifications after fetching
        user.followNotifications = [];
        await user.save();
        return res.status(200).json({notifications: notificationDetails});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error'});
    }   
};

const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = await Post.find({ author: user._id })
            .populate('author', 'username email profileImage')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                stats: {
                    followers: user.followers.length,
                    following: user.following.length,
                    posts: user.postCount,
                    likes: user.likes,
                    views: user.views
                },
                userBio: user.userBio
            },
            posts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('username email followers following _id profileImage');
        return res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const updateProfileImage = async (req, res) => {
    try {
        const { profileImage } = req.body;
        
        if (!profileImage) {
            return res.status(400).json({ message: 'Profile image URL is required' });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profileImage },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ 
            message: 'Profile image updated successfully',
            profileImage: user.profileImage 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export {getUserData, getFollowers,getFollowing, followUser, unfollowUser, getFollowNotifications, getUserByUsername, getAllUsers, updateProfileImage};
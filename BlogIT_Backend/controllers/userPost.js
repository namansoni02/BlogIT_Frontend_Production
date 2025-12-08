import User from '../models/User.js';
import Post from '../models/Post.js';

const addPost = async (req, res) => {
  try {
    
    const title = req.body.title;
    const content = req.body.content;
    const image = req.body.image;
    const tags = req.body.tags;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const newPost = await Post.create({
      title: title || '',
      content,
      image,
      tags: tags || [],
      author: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: newPost._id },
      $inc: { postCount: 1 }
    });

    return res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) { 
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this post" });
    }

    await post.deleteOne();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { posts: postId },
      $inc: { postCount: -1 }
    });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const startingPost = (page - 1) * 5;
    // const posts = await Post.find({ author: { $ne: req.user._id } }).sort({ createdAt: -1 }).skip(startingPost).limit(5).populate('author', 'username email');
    const posts = await Post.find().sort({ createdAt: -1 }).skip(startingPost).limit(5).populate('author', 'username email');
    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const likePost = async (req, res) => {
    try {
        console.log(req.params);
        console.log(req.body);
        const { postId } = req.params;  
        const like=req.body.like;
        const isLiked= await User.findOne({_id:req.user._id, likedPosts:postId});
        if(like && isLiked){
            return res.status(400).json({ message: 'Post already liked' });
        }
        if(!like && !isLiked){
            return res.status(400).json({ message: 'Post not liked yet' });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const user= await User.findByIdAndUpdate(post.author, {
            $push: { likedPosts: like ? postId : undefined },
            $pull: { likedPosts: !like ? postId : undefined },
            $inc: { likes: like?1:-1 }
        });
        post.likes += (like?1:-1);
        await post.save();
        return res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }   
};

export {addPost, deletePost, getAllPosts, likePost};
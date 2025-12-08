import express from 'express';
import {protect} from '../middlewares/authenticateToken.js';
import {addPost, deletePost, getAllPosts,likePost} from '../controllers/userPost.js';

const router = express.Router();
router.post('/', protect, addPost);
router.get('/',protect, getAllPosts);
router.delete('/delete/:postId', protect, deletePost);
router.post('/like/:postId', protect, likePost);

export default router;
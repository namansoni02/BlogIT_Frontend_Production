import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
  //console.log("Login User Called");
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    //console.log(user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ 
      message: "Login successful",
      token,
      userId: user._id
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Cannot login error' });
  }
};

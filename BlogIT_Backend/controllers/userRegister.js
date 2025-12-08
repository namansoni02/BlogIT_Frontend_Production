import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

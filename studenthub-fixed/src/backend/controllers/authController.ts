import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.ts';

// FIX 10: Validate JWT_SECRET at startup rather than silently falling back to 'secret'
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // FIX 10: Basic input validation
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // FIX 10: Use validated secret — throws if missing rather than using 'secret'
    const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email }
      },
      message: "Registration successful"
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // FIX 10: Basic input validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user: any = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // FIX 10: Use validated secret — throws if missing rather than using 'secret'
    const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email }
      },
      message: "Login successful"
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

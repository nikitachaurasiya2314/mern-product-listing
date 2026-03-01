import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import AppError from '../utils/AppError.js';

export const registerService = async ({ name, email, password }) => {
  email = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists with this email', 409);
  }

  const user = await User.create({
    name: name.trim(),
    email,
    password,
    role: 'user',
  });

  const token = generateToken(user._id);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};

export const loginService = async ({ email, password }) => {
  email = email.toLowerCase().trim();

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user._id);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};

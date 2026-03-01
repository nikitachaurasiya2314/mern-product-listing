import { registerService, loginService } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const userData = await registerService(req.body);
    res.status(201).json({ success: true, message: 'User registered successfully', data: userData });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const userData = await loginService(req.body);
    res.status(200).json({ success: true, message: 'Login successful', data: userData });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

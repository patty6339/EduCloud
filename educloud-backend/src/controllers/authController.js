const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { generateToken } = require('../config/jwt');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user || !(await user.verifyPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user.id, role: user.role });
  res.status(200).json({ token });
};

exports.signup = async (req, res) => {
  const { email, password, role } = req.body;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const newUser = await User.create({ email, password, role });
  res.status(201).json({ user: newUser });
};

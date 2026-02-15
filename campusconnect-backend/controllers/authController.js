const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (request, reply) => {
  try {
    const { name, email, password, role } = request.body;

    // Validation
    if (!name || !email || !password) {
      return reply.code(400).send({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return reply.code(400).send({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    if (user) {
      reply.code(201).send({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token: generateToken(user._id),
        },
      });
    } else {
      return reply.code(400).send({
        success: false,
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    console.error('Register Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (request, reply) => {
  try {
    const { email, password } = request.body;

    // Validation
    if (!email || !password) {
      return reply.code(400).send({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return reply.code(401).send({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return reply.code(401).send({
        success: false,
        message: 'Invalid credentials',
      });
    }

    reply.send({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (request, reply) => {
  try {
    const user = request.user;

    reply.send({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};

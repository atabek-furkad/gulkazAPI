const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')

const protect = asyncHandler(async (req, res, next) => {
  let token
  // console.log('running this 1?')
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // console.log('running this 2?')
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // console.log(decoded)

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.log('running this 3?')
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = { protect }

const express = require('express')
const router = express.Router()
const { authUser, getUserProfile } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

// @description   auth user & get token
// @route         POST /api/users/login
// @access        public
router.post('/login', authUser)

// @description   get user profile
// @route         GET /api/users/profile
// @access        public
router.get('/profile', protect, getUserProfile)

module.exports = router

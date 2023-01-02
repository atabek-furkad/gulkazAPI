const bcrypt = require('bcryptjs')

const users = [
  {
    name: 'Admin User',
    email: 'example@mail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Not Admin',
    email: 'examplenotadmin@mail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
]

module.exports = users

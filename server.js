const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')
const { logger } = require('./middleware/logger')
const fs = require('fs')
// const cors = require('cors')
// const corsOptions = require('./config/corsOptions')

// const products = require('./data/products')

dotenv.config()

connectDB()

const app = express()

// app.use(cors(corsOptions))

app.use(logger)

// to be able to process objects send from input forms with POST method
app.use(express.json())

if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdir(path.join(__dirname, 'uploads'))
}

// to be able to access uploads dir from frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const PORT = process.env.PORT

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Listening to server on port ${PORT}`)
})

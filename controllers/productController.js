const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')
const fs = require('fs')
const path = require('path')

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  if (products.length > 0) {
    res.json(products)
  } else {
    res.status(404)
    throw new Error('Products not found')
  }
})

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const addProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    user: req.user._id,
    category: req.body.category,
    countInStock: req.body.countInStock,
    description: req.body.description,
    topProduct: req.body.topProduct,
  })

  // check if there is any new attached images
  if (req.files.length != 0) {
    // push names of images to the product.images array, if there is any
    attachFiles(product, req.files)
  }

  const createdProduct = await product.save()

  res.status(201).json(createdProduct)
})

const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    countInStock,
    category,
    price,
    topProduct,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.description = description
    product.countInStock = countInStock
    product.category = category
    product.price = price
    product.topProduct = topProduct

    // check if there is any new attached images
    if (req.files.length != 0) {
      // delete from the uploads directory old images
      await deleteFiles(product)
      // clear the list of images
      product.images = []
      // push the new uploaded images' details to the product.image array
      attachFiles(product, req.files)
    }
    const updatedProduct = await product.save()
    res.json(updatedProduct)
  }
})

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  // needs to be rewritten to delete all the images from storage of the particular product
  // const unlinkFile = await product.images.slice(1)

  if (product) {
    // remove the product from the database
    await product.remove()

    // delete the files from the uploads directory
    await deleteFiles(product)

    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

function attachFiles(product, files) {
  files.forEach((file) => {
    const fileObject = {
      fileName: file.filename,
      originalName: file.originalname,
    }

    product.images.push(fileObject)
  })
}

async function deleteFiles(product) {
  await product.images.forEach((image) => {
    console.log(path.join(__dirname, '..', '..', 'uploads', image.fileName))
    const unlinkFile = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      image.fileName,
    )
    fs.unlink(unlinkFile, (err) => {
      if (err) throw err
    })
  })
}

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
}

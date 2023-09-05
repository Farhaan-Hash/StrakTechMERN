import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// get all products Public Access
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// get Selected PAGES with Pagination products Public Access
const getSelectedProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT; // Show 4 products per page
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {name: {$regex: req.query.keyword, $options: "i"}}
    : {}; //i = case insensitive

  const count = await Product.countDocuments({...keyword}); // Count number of products
  // Skip 4 products per page. If we r on 2nd page we want to skip products on the 1st page.. so on
  const products = await Product.find({...keyword})
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({products, page, pages: Math.ceil(count / pageSize)}); // Calculate number of pages
});

// Product By ID Public access
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  }
  res.status(404);
  throw new Error("Resource not Found!");
});

// Create all products Admin Access only  POST req /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// Update products Admin Access only  PUT req /api/products
const updateProduct = asyncHandler(async (req, res) => {
  const {name, price, description, image, brand, category, countInStock} =
    req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Resource not Found!");
  }
});

// Delete Product Admin Access only  DELETE req /api/products
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({_id: product._id});
    res.status(200).json({message: "Product removed"});
  } else {
    res.status(404);
    throw new Error("Resource not Found!");
  }
});

// Create A New Review Admin Access only  POST req /api/products/:id/reviews

const createProductReview = asyncHandler(async (req, res) => {
  const {rating, comment} = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    //review schema user id matched to the logged in user id (review schema user)
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }
    //data coming from frontend
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(200).json({message: "Review Added"});
  } else {
    res.status(404);
    throw new Error("Resource not Found!");
  }
});

// Inside your backend code (e.g., productController.js), you can add a controller function to handle deleting reviews.

// Delete Review by ID - Admin Access only DELETE req /api/products/:productId/reviews/:reviewId
const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (product) {
    const review = product.reviews.find(
      (review) => review._id.toString() === req.params.reviewId
    );

    if (review) {
      product.reviews = product.reviews.filter(
        (review) => review._id.toString() !== req.params.reviewId
      );

      product.numReviews = product.reviews.length;

      if (product.numReviews === 0) {
        product.rating = 0; // Set rating to 0 if there are no reviews
      } else {
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.numReviews;
      }

      await product.save();
      res.status(200).json({message: "Review deleted"});
    } else {
      res.status(404);
      throw new Error("Review not found");
    }
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// GET Top Rated Products for Carousel Home Screen Frontend
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({rating: -1}).limit(4);
  res.status(200).json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  deleteReview,
  getTopProducts,
  getSelectedProducts,
};

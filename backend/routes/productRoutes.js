import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  deleteReview,
  getTopProducts,
  getSelectedProducts,
} from "../controllers/productController.js";
import {protect, admin} from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get all products
// router.get("/", getProducts);
router.route("/").get(getProducts);

router.route("/selected").get(getSelectedProducts);

// Carousel products for banner
router.route("/top").get(getTopProducts);

// Route to get a single product by ID
// router.get("/:id", getProductById);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Review Route
router.route("/:id/reviews").post(protect, createProductReview);

// Delete Review by ID - Admin Access only DELETE req /api/products/:productId/reviews/:reviewId
router.delete("/:productId/reviews/:reviewId", protect, deleteReview);

router.route("/").post(protect, admin, createProduct);

export default router;

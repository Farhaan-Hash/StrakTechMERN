import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import {errorHandler, notFound} from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import uploadRoutes from "./routes/uploadRoutes.js";
dotenv.config();

const port = process.env.PORT || 5000;

// Connect with MongoDB
connectDB();

const app = express();

// uploads folder static
const __dirname = path.resolve(); // path.resolve() returns the absolute path of the file from the current working directory
app.use("/images", express.static(path.join(__dirname, "/images")));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cookie Parser Middleware
app.use(cookieParser());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// PAYPAL
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// Set Static Folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  // Any route that is not /api or /uploads goes to frontend/build index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Image Uploads
app.use("/api/upload", uploadRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is Live on port ${port}`));

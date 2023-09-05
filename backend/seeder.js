import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

// Upload data to MongoDB----------------------------------------------------------

const importData = async () => {
  try {
    // First clear database
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    // Populating db with data
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Products added with Admin user
    const sampleProducts = products.map((product) => {
      return {...product, user: adminUser};
    });
    await Product.insertMany(sampleProducts);
    console.log("Data Upstream Successfully!".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error, "Upstream data failed!".red.inverse);
    process.exit(1);
  }
};

// ! Delete all upstream data-----------------------------------------------

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    console.log("Data Deleted!".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error, "Data deletion failed!".red.inverse);
    process.exit(1);
  }
};

// console.log(process.argv[2]);

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

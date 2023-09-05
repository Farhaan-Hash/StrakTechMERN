import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

// Create a New Order  Post req /api/orders Private Access------------------------------------
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  console.log(req.body);

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    console.log(req.user._id);
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        product: x.product,
        name: x.name,
        qty: x.qty,
        price: x.price,
        image: x.image, // Use the provided image URL
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// Get Logged in Users Order - Get req /api/orders/myorders Private Access------------------------------------
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({user: req.user._id});
  res.json(orders);
});

// Get All Orders by Id  - Get req /api/orders/:id Private Access------------------------------------
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user", //populate user details from DB with name and email field
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// Update Order to Paid - Put req /api/orders/:id/pay" Admin Private Access------------------------------------
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// Update Order to Delivered - Put req /api/orders/:id/deliver" Admin Private Access------------------------------------
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id); //find order first
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// Get All Orders - Get req /api/orders Admin Private Access------------------------------------
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate(
    "user", //populate user details from DB with name and id field
    "name id"
  );
  res.status(200).json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};

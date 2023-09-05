import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";
import reportWebVitals from "./reportWebVitals";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import {Provider} from "react-redux";
import store from "./store";
import {PersistGate} from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OrderListScreen from "./screens/admin/OrderListScreen";
import ProductListScreen from "./screens/admin/ProductListScreen";
import ProductEditScreen from "./screens/admin/ProductEditScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";
import ProductsScreen from "./screens/ProductsScreen";
import TestProductsScreen from "./screens/TestProductsScreen";
import {HelmetProvider} from "react-helmet-async";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/selected" element={<TestProductsScreen />}></Route>
      <Route
        path="/selected/search/:keyword"
        element={<TestProductsScreen />}
      ></Route>
      <Route
        path="/selected/search/:keyword/page/:pageNumber"
        element={<TestProductsScreen />}
      ></Route>
      {/* //For Pagination */}
      <Route
        path="/selected/page/:pageNumber"
        element={<TestProductsScreen />}
      ></Route>
      <Route path="/" index={true} element={<HomeScreen />}></Route>
      <Route
        path="/product/:id"
        index={true}
        element={<ProductScreen />}
      ></Route>
      <Route path="/cart" index={true} element={<CartScreen />}></Route>
      <Route path="/login" index={true} element={<LoginScreen />}></Route>
      <Route path="/register" index={true} element={<RegisterScreen />}></Route>
      <Route path="/products" index={true} element={<ProductsScreen />}></Route>
      {/* //Private Route User--------------------- */}
      <Route path="" element={<PrivateRoute />}>
        <Route
          path="/shipping"
          index={true}
          element={<ShippingScreen />}
        ></Route>
        <Route path="/payment" index={true} element={<PaymentScreen />}></Route>
        <Route
          path="/placeorder"
          index={true}
          element={<PlaceOrderScreen />}
        ></Route>
        <Route path="/order/:id" index={true} element={<OrderScreen />}></Route>
        <Route path="/profile" index={true} element={<ProfileScreen />}></Route>
      </Route>
      {/* Admin Route---------------------------------------------------------------------------------------------- */}
      <Route path="" element={<AdminRoute />}>
        <Route
          path="/admin/orderlist"
          index={true}
          element={<OrderListScreen />}
        ></Route>
        <Route
          path="/admin/productlist"
          index={true}
          element={<ProductListScreen />}
        ></Route>
        <Route
          path="/admin/productlist/:pageNumber"
          index={true}
          element={<ProductListScreen />}
        ></Route>
        <Route
          path="/admin/product/:id/edit"
          index={true}
          element={<ProductEditScreen />}
        ></Route>
        <Route
          path="/admin/userlist"
          index={true}
          element={<UserListScreen />}
        ></Route>
        <Route
          path="/admin/userlist/:id/edit"
          index={true}
          element={<UserEditScreen />}
        ></Route>
      </Route>
    </Route>
  )
);
const persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <PayPalScriptProvider deferLoading={false}>
            <RouterProvider router={router} />
          </PayPalScriptProvider>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
reportWebVitals();

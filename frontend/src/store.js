import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {apiSlice} from "./slices/apiSlice";
import cartSliceReducer from "./slices/cartSlice";
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSliceReducer from "./slices/authSlice";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const reducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  cart: cartSliceReducer,
  auth: authSliceReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;

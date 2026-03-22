import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import listingReducer from "./slices/listingSlice";
import rentalReducer from "./slices/rentalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingReducer,
    rentals: rentalReducer,
  },
});

export default store;

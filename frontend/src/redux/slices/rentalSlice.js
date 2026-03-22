import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const requestRental = createAsyncThunk("rentals/request", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/rentals", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to request rental");
  }
});

export const fetchMyRentals = createAsyncThunk("rentals/fetchMy", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/rentals/my");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchIncomingRentals = createAsyncThunk("rentals/fetchIncoming", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/rentals/incoming");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateRentalStatus = createAsyncThunk("rentals/updateStatus", async ({ id, action }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/rentals/${id}/${action}`);
    return res.data.rental;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const rentalSlice = createSlice({
  name: "rentals",
  initialState: {
    myRentals: [],
    incomingRentals: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearRentalMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestRental.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(requestRental.fulfilled, (s, a) => { s.loading = false; s.success = "Rental requested!"; s.myRentals.unshift(a.payload); })
      .addCase(requestRental.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchMyRentals.fulfilled, (s, a) => { s.myRentals = a.payload; })
      .addCase(fetchIncomingRentals.fulfilled, (s, a) => { s.incomingRentals = a.payload; })

      .addCase(updateRentalStatus.fulfilled, (s, a) => {
        const updated = a.payload;
        s.incomingRentals = s.incomingRentals.map((r) => r._id === updated._id ? updated : r);
        s.myRentals = s.myRentals.map((r) => r._id === updated._id ? updated : r);
      });
  },
});

export const { clearRentalMessages } = rentalSlice.actions;
export default rentalSlice.reducer;

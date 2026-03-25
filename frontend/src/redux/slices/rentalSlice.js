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

// After updating status, re-fetch both lists so UI is always in sync
export const updateRentalStatus = createAsyncThunk("rentals/updateStatus", async ({ id, action }, { dispatch, rejectWithValue }) => {
  try {
    await api.put(`/rentals/${id}/${action}`);
    // Re-fetch fresh data from server
    dispatch(fetchMyRentals());
    dispatch(fetchIncomingRentals());
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
      .addCase(requestRental.fulfilled, (s, a) => {
        s.loading = false;
        s.success = "Rental requested!";
        s.myRentals.unshift(a.payload);
      })
      .addCase(requestRental.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchMyRentals.pending, (s) => { s.loading = true; })
      .addCase(fetchMyRentals.fulfilled, (s, a) => {
        s.loading = false;
        s.myRentals = Array.isArray(a.payload) ? a.payload : [];
      })
      .addCase(fetchMyRentals.rejected, (s) => { s.loading = false; })

      .addCase(fetchIncomingRentals.pending, (s) => { s.loading = true; })
      .addCase(fetchIncomingRentals.fulfilled, (s, a) => {
        s.loading = false;
        s.incomingRentals = Array.isArray(a.payload) ? a.payload : [];
      })
      .addCase(fetchIncomingRentals.rejected, (s) => { s.loading = false; })

      .addCase(updateRentalStatus.rejected, (s, a) => {
        s.error = a.payload;
      });
  },
});

export const { clearRentalMessages } = rentalSlice.actions;
export default rentalSlice.reducer;
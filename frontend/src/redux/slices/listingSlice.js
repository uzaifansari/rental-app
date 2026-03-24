import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchListings = createAsyncThunk("listings/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get("/listings", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch listings");
  }
});

export const fetchMyListings = createAsyncThunk("listings/fetchMy", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/listings/my");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchListingById = createAsyncThunk("listings/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/listings/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createListing = createAsyncThunk("listings/create", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post("/listings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteListing = createAsyncThunk("listings/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/listings/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const listingSlice = createSlice({
  name: "listings",
  initialState: {
    listings: [],
    myListings: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected(state) { state.selected = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.listings = [];
      })

      .addCase(fetchMyListings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.loading = false;
        state.myListings = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMyListings.rejected, (state) => { state.loading = false; })

      .addCase(fetchListingById.pending, (state) => { state.loading = true; state.selected = null; })
      .addCase(fetchListingById.fulfilled, (state, action) => { state.loading = false; state.selected = action.payload; })
      .addCase(fetchListingById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createListing.fulfilled, (state, action) => {
        state.myListings.unshift(action.payload);
      })

      .addCase(deleteListing.fulfilled, (state, action) => {
        state.myListings = state.myListings.filter((l) => l._id !== action.payload);
      });
  },
});

export const { clearSelected } = listingSlice.actions;
export default listingSlice.reducer;
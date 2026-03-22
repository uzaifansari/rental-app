import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchListings = createAsyncThunk("listings/fetchAll", async (params = {}) => {
  const res = await api.get("/listings", { params });
  return res.data;
});

export const fetchMyListings = createAsyncThunk("listings/fetchMy", async () => {
  const res = await api.get("/listings/my");
  return res.data;
});

export const fetchListingById = createAsyncThunk("listings/fetchById", async (id) => {
  const res = await api.get(`/listings/${id}`);
  return res.data;
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

export const deleteListing = createAsyncThunk("listings/delete", async (id) => {
  await api.delete(`/listings/${id}`);
  return id;
});

const listingSlice = createSlice({
  name: "listings",
  initialState: { items: [], myListings: [], selected: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => { state.loading = true; })
      .addCase(fetchListings.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchMyListings.fulfilled, (state, action) => { state.myListings = action.payload; })
      .addCase(fetchListingById.fulfilled, (state, action) => { state.selected = action.payload; })
      .addCase(createListing.fulfilled, (state, action) => { state.myListings.unshift(action.payload); })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.myListings = state.myListings.filter((l) => l._id !== action.payload);
      });
  },
});

export default listingSlice.reducer;

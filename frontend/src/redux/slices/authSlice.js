import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const signup = createAsyncThunk("auth/signup", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/signup", data);
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Signup failed");
  }
});

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null, initialized: false },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("token");
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const handle = (thunk) => {
      builder
        .addCase(thunk.pending, (state) => { state.loading = true; state.error = null; })
        .addCase(thunk.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; state.initialized = true; })
        .addCase(thunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.initialized = true; });
    };
    handle(signup); handle(login);
    builder
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; state.initialized = true; })
      .addCase(fetchMe.rejected, (state) => { state.initialized = true; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

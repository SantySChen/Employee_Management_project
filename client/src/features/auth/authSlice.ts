import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  completeRegistration,
  login as loginAPI,
  verifyRegistrationToken,
} from "./authAPI";
import type {
  LoginPayload,
  AuthState,
  AuthResponse,
  RegisterRequest,
} from "./types";
import { parseErrorMessage } from "../../app/utils/parseErrorMessage";

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  email: localStorage.getItem("email") || null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, thunkAPI) => {
  try {
    const res = await loginAPI(payload);
    localStorage.setItem("token", res.token);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err) as string);
  }
});

export const verifyToken = createAsyncThunk<
  { valid: boolean },
  string,
  { rejectValue: string }
>("auth/verifyToken", async (token, thunkAPI) => {
  try {
    const res = await verifyRegistrationToken(token);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: string }
>("auth/register", async (payload, thunkAPI) => {
  try {
    const res = await completeRegistration(payload);
    localStorage.setItem("token", res.token);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.email = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("email");
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.email = action.payload.user.email;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("email", action.payload.user.email);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      // verifyToken
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.tokenValid = undefined;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.tokenValid = action.payload.valid;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.tokenValid = false;
        state.error = action.payload as string;
      })
      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.email = action.meta.arg.email;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

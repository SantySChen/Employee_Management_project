import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Visa, VisaState, VisaStatus, VisaStepKey } from "./types";
import {
  createVisa,
  getVisaByUserId,
  reviewVisaStep,
  uploadVisaFile,
} from "./visaAPI";
import { parseErrorMessage } from "../../app/utils/parseErrorMessage";
import { logout } from "../auth/authSlice";

const initialState: VisaState = {
  data: null,
  loading: false,
  error: null,
};

export const createVisaThunk = createAsyncThunk<
  Visa,
  { userId: string; optReceiptFile: string },
  { rejectValue: string }
>("visa/create", async ({ userId, optReceiptFile }, thunkAPI) => {
  try {
    const res = await createVisa(userId, optReceiptFile);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

export const fetchVisa = createAsyncThunk<
  Visa,
  string,
  { rejectValue: string }
>("visa/fetch", async (userId, thunkAPI) => {
  try {
    const res = await getVisaByUserId(userId);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

export const uploadVisa = createAsyncThunk<
  Visa,
  { userId: string; step: VisaStepKey; file: File },
  { rejectValue: string }
>("visa/upload", async ({ userId, step, file }, thunkAPI) => {
  try {
    const res = await uploadVisaFile(userId, step, file);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

export const reviewVisa = createAsyncThunk<
  Visa,
  { userId: string; step: VisaStepKey; status: VisaStatus; feedback?: string },
  { rejectValue: string }
>("visa/review", async ({ userId, step, status, feedback }, thunkAPI) => {
  try {
    const res = await reviewVisaStep(userId, step, status, feedback);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

const visaSlice = createSlice({
  name: "visa",
  initialState,
  reducers: {
    clearVisa(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // create visa
      .addCase(createVisaThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVisaThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createVisaThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Create visa failed";
      })
      // fetchVisa
      .addCase(fetchVisa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisa.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchVisa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch visa data.";
      })

      // uploadVisa
      .addCase(uploadVisa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVisa.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(uploadVisa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload visa document.";
      })

      // reviewVisa
      .addCase(reviewVisa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewVisa.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(reviewVisa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to review visa document.";
      })

      // logout resets visa state
      .addCase(logout, () => initialState);
  },
});

export const { clearVisa } = visaSlice.actions;
export default visaSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Onboarding } from "./types";
import {
  create,
  getOnboardingByUserId,
  updateOnboardingByUserId,
} from "./onboardingAPI";
import { parseErrorMessage } from "../../app/utils/parseErrorMessage";
import { logout } from "../auth/authSlice";

interface OnboardingState {
  data: Onboarding | null;
  loading: boolean;
  error: string | null;
}

const initialState: OnboardingState = {
  data: null,
  loading: false,
  error: null,
};

// Thunks
export const submitOnboarding = createAsyncThunk<
  Onboarding,
  FormData,
  { rejectValue: string }
>("onboarding/submit", async (formData, thunkAPI) => {
  try {
    const res = await create(formData);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

export const fetchOnboarding = createAsyncThunk<
  Onboarding,
  string,
  { rejectValue: string }
>("onboarding/fetch", async (userId, thunkAPI) => {
  try {
    const res = await getOnboardingByUserId(userId);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

export const updateOnboarding = createAsyncThunk<
  Onboarding,
  { userId: string; formData: FormData },
  { rejectValue: string }
>("onboarding/update", async ({ userId, formData }, thunkAPI) => {
  try {
    const res = await updateOnboardingByUserId(userId, formData);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    clearOnboarding(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // submit
      .addCase(submitOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(submitOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit onboarding.";
      })
      // fetch
      .addCase(fetchOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch onboarding.";
      })
      // update
      .addCase(updateOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update onboarding.";
      })
      // logout
      .addCase(logout, () => initialState);
  },
});

export const { clearOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;

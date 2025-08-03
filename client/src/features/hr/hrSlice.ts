import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateTokenAndSendEmail } from "./hrAPI";
import { parseErrorMessage } from "../../app/utils/parseErrorMessage";
import type { HrState } from "./types";

const initialState: HrState = {
  loading: false,
  error: null,
  success: false,
};

export const inviteEmployee = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("hr/inviteEmployee", async (email, thunkAPI) => {
  try {
    await generateTokenAndSendEmail(email);
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {
    resetHRState(state) {
        state.error = null;
        state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(inviteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteEmployee.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(inviteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      });
  },
});

export const { resetHRState } = hrSlice.actions;
export default hrSlice.reducer;

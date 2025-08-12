import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  fetchAllVisas,
  generateTokenAndSendEmail,
  getAllApprovedOnboardings,
  getAllOnboardings,
  searchOnboardingByStatus,
  searchOnboardings,
  updateOnboardingStatus,
} from "./hrAPI";
import { parseErrorMessage } from "../../app/utils/parseErrorMessage";
import type {
  HrState,
  Onboarding,
  PaginatedOnboardings,
  PaginatedVisas,
  SearchParams,
} from "./types";
import { logout } from "../auth/authSlice";

const initialState: HrState = {
  onboardings: [],
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,

  searchResults: [],
  searchPage: 1,
  searchTotalPages: 1,
  isSearching: false,
  searchQuery: "",

  onboardingsByStatus: {
    Pending: { data: [], currentPage: 1, totalPages: 1, totalItems: 0 },
    Approved: { data: [], currentPage: 1, totalPages: 1, totalItems: 0 },
    Rejected: { data: [], currentPage: 1, totalPages: 1, totalItems: 0 },
  },

  visas: [],
  visaPage: 1,
  totalVisaPages: 0,
  totalVisaItems: 0,

  approvedOnboardings: [],

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

export const fetchAllOnboardings = createAsyncThunk<
  PaginatedOnboardings,
  number,
  { rejectValue: string }
>("hr/fetchAll", async (page = 1, thunkAPI) => {
  try {
    const res = await getAllOnboardings(page);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

export const searchOnboardingByName = createAsyncThunk<
  PaginatedOnboardings,
  SearchParams,
  { rejectValue: string }
>("hr/searchByName", async ({ query, page, field }, thunkAPI) => {
  try {
    const res = await searchOnboardings(query, page, field);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

export const fetchOnboardingsByStatus = createAsyncThunk<
  {
    onboardings: Onboarding[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  },
  { status: string; page?: number },
  { rejectValue: string }
>("hr/fetchOnboardingsByStatus", async (params, thunkAPI) => {
  try {
    const data = await searchOnboardingByStatus(params);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

export const changeStatus = createAsyncThunk<
  Onboarding,
  {
    id: string;
    status: "Approved" | "Rejected" | "Pending";
    feedback?: string;
  },
  { rejectValue: string }
>("hr/changeStatus", async (payload, thunkAPI) => {
  try {
    return await updateOnboardingStatus(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

export const fetchAllVisasThunk = createAsyncThunk<
  PaginatedVisas,
  number,
  { rejectValue: string }
>("hr/fetchAllVisas", async (page = 1, thunkAPI) => {
  try {
    const res = await fetchAllVisas(page);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(parseErrorMessage(err));
  }
});

export const fetchAllApprovedOnboardings = createAsyncThunk<
  Onboarding[],
  void,
  { rejectValue: string }
>("hr/fetchAllApprovedOnboardings", async (_, thunkAPI) => {
  try {
    const res = await getAllApprovedOnboardings();
    return res;
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
    setHRPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetSearch(state) {
      state.isSearching = false;
      state.searchQuery = "";
      state.searchResults = [];
      state.searchPage = 1;
      state.searchTotalPages = 1;
    },
    moveOnboardingToStatus(
      state,
      action: PayloadAction<{ id: string; newStatus: "Approved" | "Rejected" }>
    ) {
      const { id, newStatus } = action.payload;

      for (const status of ["Pending", "Approved", "Rejected"] as const) {
        const list = state.onboardingsByStatus[status];
        const index = list.data.findIndex((o) => o._id === id);
        if (index !== -1) {
          const [item] = list.data.splice(index, 1);
          item.status = newStatus;
          state.onboardingsByStatus[newStatus].data.unshift(item);
          break;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // invite
      .addCase(inviteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteEmployee.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(inviteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      })
      // fetch all profiles
      .addCase(fetchAllOnboardings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOnboardings.fulfilled, (state, action) => {
        state.loading = false;
        state.onboardings = action.payload.onboardings;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchAllOnboardings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch onboardings";
      })
      // search
      .addCase(searchOnboardingByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchOnboardingByName.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.onboardings;
        state.searchPage = action.payload.currentPage;
        state.searchTotalPages = action.payload.totalPages;
        state.isSearching = true;
        state.searchQuery = action.meta.arg.query;
      })
      .addCase(searchOnboardingByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Search failed";
      })
      // fetch onboardings by status
      .addCase(fetchOnboardingsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnboardingsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        const status = action.meta.arg.status as
          | "Pending"
          | "Approved"
          | "Rejected";
        state.onboardingsByStatus[status] = {
          data: action.payload.onboardings,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
        };
      })
      .addCase(fetchOnboardingsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      // update status
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.onboardings = state.onboardings.map((o) =>
          o._id === updated._id ? updated : o
        );
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error updating status";
      })
      // fetch all visa
      .addCase(fetchAllVisasThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVisasThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.visas = action.payload.data;
        state.visaPage = action.payload.currentPage;
        state.totalVisaPages = action.payload.totalPages;
        state.totalVisaItems = action.payload.totalItems;
      })
      .addCase(fetchAllVisasThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch visa records";
      })
      .addCase(fetchAllApprovedOnboardings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllApprovedOnboardings.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedOnboardings = action.payload;
      })
      .addCase(fetchAllApprovedOnboardings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      // logout
      .addCase(logout, () => initialState);
  },
});

export const { resetHRState, setHRPage, moveOnboardingToStatus } =
  hrSlice.actions;
export default hrSlice.reducer;

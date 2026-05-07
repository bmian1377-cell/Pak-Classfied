import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = 'http://localhost:3300/api/v1/advertisment';


export const fetchAdvertisments = createAsyncThunk(
    'advertisment/fetchAll',
    async ({ isLatest = false }, { rejectWithValue }) => {
        try {
            const url = isLatest ? `${BASE_URL}?latest=true` : BASE_URL;
            const response = await axios.get(url);
            return { data: response.data.advertisements, type: isLatest ? 'latest' : 'all' };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
);


// for this file CategoryAds.jsx
export const fetchAdsByCategory = createAsyncThunk(
    'advertisment/fetchByCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/category/${categoryId}`);
            return response.data.advertisements;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
);

export const fetchAdDetail = createAsyncThunk(
    'advertisment/fetchDetail',
    async (adId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/${adId}`);
            return response.data.advertisement;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
);

export const fetchMyAds = createAsyncThunk(
    'advertisment/fetchMyAds',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const token = state.user.token; 
            const response = await axios.get(`${BASE_URL}/my/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.advertisements;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// for formhandling.jsx
export const searchAds = createAsyncThunk(
    'advertisment/search',
    async ({ keyword, category, area }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/search?keyword=${keyword}&category=${category}&area=${area}`);
            return response.data.advertisements;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const initialState = {
    list: [],
    latestAds: [],
    categoryAds: [],
    userAds: [], 
    details: null,
    loading: 'idle',
    error: null,
}

const advertisementsSlice = createSlice({
    name: 'advertisment',
    initialState,
    reducers: {
        clearDetail: (state) => { state.details = null; }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All/Latestposting.jsx
            .addCase(fetchAdvertisments.pending, (state) => { state.loading = 'pending'; })
            .addCase(fetchAdvertisments.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                if (action.payload.type === 'latest') state.latestAds = action.payload.data;
                else state.list = action.payload.data;
            })
            // Fetch Category Ads
            .addCase(fetchAdsByCategory.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.categoryAds = action.payload;
            })
            // Fetch My Ads on Dashboard(userprofile.jsx)
            .addCase(fetchMyAds.pending, (state) => { state.loading = 'pending'; })
            .addCase(fetchMyAds.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.userAds = action.payload;
            })
            .addCase(fetchMyAds.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            })
            // Ad Detail
            .addCase(fetchAdDetail.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.details = action.payload;
            })
            // --- SEARCH ADS CASES ---
            .addCase(searchAds.pending, (state) => { 
                state.loading = 'pending'; 
                state.error = null;
            })
            .addCase(searchAds.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.list = action.payload; 
            })
            .addCase(searchAds.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            });
    }
});

export const { clearDetail } = advertisementsSlice.actions;
export default advertisementsSlice.reducer;
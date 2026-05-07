import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const BASE_URL = "http://localhost:3300/api/v1";


export const fetchReferenceData = createAsyncThunk(

    'reference/fetchReferenceData',

    async (_, { rejectWithValue }) => {
        try {
            const [catRes, statusRes, areaRes] = await Promise.all([
                axios.get(`${BASE_URL}/category`),
                axios.get(`${BASE_URL}/status`),
                axios.get(`${BASE_URL}/area`),
            ]);

            const extractData = (res) => res.data.data || res.data.items || res.data.categories || res.data.statuses || res.data.areas || (Array.isArray(res.data) ? res.data : []);

            return {
                categories: extractData(catRes),
                statuses: extractData(statusRes),
                areas: extractData(areaRes)
            }

        } catch (error) {
            console.error("Reference Data Fetch Error:", error.response || error);

            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch reference data.');
        }
    }
)

const referenceSlice = createSlice({

    name: "reference",
    initialState: {
        categories: [],
        areas: [],
        statuses: [],
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(fetchReferenceData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReferenceData.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories;
                state.areas = action.payload.areas;
                state.statuses = action.payload.statuses;
            })

            .addCase(fetchReferenceData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }

})

export default referenceSlice.reducer;
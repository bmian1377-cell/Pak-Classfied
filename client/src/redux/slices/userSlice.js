import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3300/api/v1/auth';

export const registerUser = createAsyncThunk('user/registerUser', async (formData, { rejectWithValue }) => {
    try {
        return (await axios.post(`${API_BASE_URL}/register`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })).data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const loginUser = createAsyncThunk('user/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        return (await axios.post(`${API_BASE_URL}/login`, credentials)).data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const userSlice = createSlice({
    name: 'user',
    initialState: { 
        user: JSON.parse(localStorage.getItem('user')) || null,
         token: localStorage.getItem('userToken') || null 
        },
    reducers: {
        logout: (state) => {
            state.user = null; state.token = null;
            localStorage.clear();
            delete axios.defaults.headers.common['Authorization'];
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            (action) => action.type.endsWith('/fulfilled') && action.type.includes('User'), 
            (state, action) => {
                const { token, user: rawUser } = action.payload;
                state.token = token;
                
                // Ensures all keys are properly saved
                const mappedUser = {
                    Name: rawUser.Name,
                    Email: rawUser.Email,
                    LoginID: rawUser.LoginID,
                    ContactNumber: rawUser.ContactNumber, 
                    Image: rawUser.Image
                };
                
                state.user = mappedUser;
                localStorage.setItem('userToken', token);
                localStorage.setItem('user', JSON.stringify(mappedUser));
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        );
    }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
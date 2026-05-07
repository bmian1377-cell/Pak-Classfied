import { configureStore } from "@reduxjs/toolkit";
import referenceReducer from '../features/reference/refernceSlice';
import advertismentReducer from '../redux/slices/advertisementsSlice'
import userReducer from '../redux/slices/userSlice'

export const store = configureStore({
    reducer: {
        reference: referenceReducer,
        advertisment: advertismentReducer,
        user:userReducer
    }
})
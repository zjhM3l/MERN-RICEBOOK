import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateProfileSuccess: (state, action) => {
            state.currentUser = { ...state.currentUser, ...action.payload };
        }
    }
});

export const { signInStart, signInSuccess, signInFailure, updateProfileSuccess } = userSlice.actions;

export default userSlice.reducer;
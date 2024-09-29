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
        },
        // 新的 reducer：更新 currentUser 的 following 列表
        updateFollowingSuccess: (state, action) => {
            state.currentUser.following = action.payload.following; // 更新 following 列表
        },
    },
});

export const { 
    signInStart, 
    signInSuccess, 
    signInFailure, 
    updateProfileSuccess, 
    updateFollowingSuccess // 导出新的 action
} = userSlice.actions;

export default userSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthState, IUser } from '../types/authTypes';

const initialState: IAuthState = {
	user: null,
	accessToken: localStorage.getItem('accessToken'),
	refreshToken: localStorage.getItem('refreshToken'),
	isLoading: false,
	error: null,
	isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		registerRequest: (state) => {
			state.isLoading = true;
			state.error = null;
		},

		registerSuccess: (
			state,
			action: PayloadAction<{
				user: IUser;
				accessToken: string;
				refreshToken: string;
			}>
		) => {
			state.isLoading = false;
			state.user = action.payload.user;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.isAuthenticated = true;
			state.error = null;
		},

		registerFailed: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.error = action.payload;
			state.isAuthenticated = false;
		},

		loginRequest: (state) => {
			state.isLoading = true;
			state.error = null;
		},

		loginSuccess: (
			state,
			action: PayloadAction<{
				user: IUser;
				accessToken: string;
				refreshToken: string;
			}>
		) => {
			state.isLoading = false;
			state.user = action.payload.user;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.isAuthenticated = true;
			state.error = null;
		},

		loginFailed: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.error = action.payload;
			state.isAuthenticated = false;
		},

		logoutRequest: (state) => {
			state.isLoading = true;
			state.error = null;
		},

		logoutSuccess: (state) => {
			state.isLoading = false;
			state.user = null;
			state.accessToken = null;
			state.refreshToken = null;
			state.isAuthenticated = false;
			state.error = null;
		},

		logoutFailed: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.error = action.payload;
		},

		updateTokenRequest: (state) => {
			state.isLoading = true;
			state.error = null;
		},

		updateTokenSuccess: (
			state,
			action: PayloadAction<{ accessToken: string; refreshToken: string }>
		) => {
			state.isLoading = false;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.error = null;
		},

		updateTokenFailed: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.error = action.payload;
			state.isAuthenticated = false;
		},

		getProfileRequest: (state) => {
			state.isLoading = true;
			state.error = null;
		},

		getProfileSuccess: (state, action: PayloadAction<IUser>) => {
			state.isLoading = false;
			state.user = action.payload;
			state.error = null;
		},

		getProfileFailed: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.error = action.payload;
		},

		updateProfileRequest: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		updateProfileSuccess: (state, action: PayloadAction<IUser>) => {
			state.isLoading = false;
			state.user = action.payload;
			state.error = null;
		},
		updateProfileFailed: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.error = action.payload;
		},

		clearError: (state) => {
			state.error = null;
		},
	},
});

export const {
	registerRequest,
	registerSuccess,
	registerFailed,
	loginRequest,
	loginSuccess,
	loginFailed,
	logoutRequest,
	logoutSuccess,
	logoutFailed,
	updateTokenRequest,
	updateTokenSuccess,
	updateTokenFailed,
	getProfileRequest,
	getProfileSuccess,
	getProfileFailed,
	updateProfileRequest,
	updateProfileSuccess,
	updateProfileFailed,
	clearError,
} = authSlice.actions;

export default authSlice.reducer;

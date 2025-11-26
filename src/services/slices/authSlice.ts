import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
	register,
	login,
	logout,
	updateToken,
	getProfile,
	updateProfile,
} from '../../utils/authActions';

import { IAuthState, IUpdateProfileData } from '../types/authTypes';

export const registerUser = createAsyncThunk(
	'auth/register',
	async (credentials: { email: string; password: string; name: string }) => {
		const response = await register(credentials);
		localStorage.setItem('accessToken', response.accessToken);
		localStorage.setItem('refreshToken', response.refreshToken);
		return response;
	}
);

export const loginUser = createAsyncThunk(
	'auth/login',
	async (credentials: { email: string; password: string }) => {
		const response = await login(credentials);
		localStorage.setItem('accessToken', response.accessToken);
		localStorage.setItem('refreshToken', response.refreshToken);
		return response;
	}
);

export const logoutUser = createAsyncThunk(
	'auth/logout',
	async (_, { getState }) => {
		const state = getState() as { auth: IAuthState };
		const token = state.auth.refreshToken;

		if (token) {
			await logout(token);
		}

		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		return;
	}
);

export const updateUserToken = createAsyncThunk(
	'auth/updateToken',
	async (_, { getState }) => {
		const state = getState() as { auth: IAuthState };
		const token = state.auth.refreshToken;

		if (!token) {
			throw new Error('Нет refresh token');
		}

		const response = await updateToken(token);
		localStorage.setItem('accessToken', response.accessToken);
		localStorage.setItem('refreshToken', response.refreshToken);
		return response;
	}
);

export const getUserProfile = createAsyncThunk(
	'auth/getProfile',
	async (_, { getState }) => {
		const state = getState() as { auth: IAuthState };
		const token = state.auth.accessToken;

		if (!token) {
			throw new Error('Нет access token');
		}

		const response = await getProfile(token);
		return response.user;
	}
);

export const updateUserProfile = createAsyncThunk(
	'auth/updateProfile',
	async (userData: IUpdateProfileData, { getState }) => {
		const state = getState() as { auth: IAuthState };
		const token = state.auth.accessToken;

		if (!token) {
			throw new Error('Нет access token');
		}

		const response = await updateProfile(userData, token);
		return response.user;
	}
);

export const initialState: IAuthState = {
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
		clearError: (state) => {
			state.error = null;
		},

		setTokens: (state, action) => {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.isAuthenticated = true;
		},

		clearTokens: (state) => {
			state.accessToken = null;
			state.refreshToken = null;
			state.isAuthenticated = false;
			state.user = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})

			.addCase(registerUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				state.isAuthenticated = true;
				state.error = null;
			})

			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Ошибка регистрации';
				state.isAuthenticated = false;
			})

			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})

			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				state.isAuthenticated = true;
				state.error = null;
			})

			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Ошибка входа';
				state.isAuthenticated = false;
			})

			.addCase(logoutUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})

			.addCase(logoutUser.fulfilled, (state) => {
				state.isLoading = false;
				state.user = null;
				state.accessToken = null;
				state.refreshToken = null;
				state.isAuthenticated = false;
				state.error = null;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Ошибка выхода';
				state.user = null;
				state.accessToken = null;
				state.refreshToken = null;
				state.isAuthenticated = false;
			})

			.addCase(updateUserToken.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})

			.addCase(updateUserToken.fulfilled, (state, action) => {
				state.isLoading = false;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				state.error = null;
			})

			.addCase(updateUserToken.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Ошибка обновления токена';
				state.isAuthenticated = false;
				state.accessToken = null;
				state.refreshToken = null;
			})

			.addCase(getUserProfile.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})

			.addCase(getUserProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
				state.error = null;
			})

			.addCase(getUserProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Ошибка получения профиля';
			})

			.addCase(updateUserProfile.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})

			.addCase(updateUserProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
				state.error = null;
			})

			.addCase(updateUserProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Ошибка обновления профиля';
			});
	},
});

export const { clearError, setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;

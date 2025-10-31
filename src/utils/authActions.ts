import { AppDispatch, RootState } from '../services/store';
import {
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
} from '../services/slices/authSlice';

import { BASE_URL } from '../consts';

import {
	IRegisterData,
	ILoginData,
	IAuthResponse,
	ILogoutResponse,
	IUpdateTokenResponse,
	IUserResponse,
	IUpdateProfileData,
} from '../services/types/authTypes';

import { checkResponse } from './checkResponse';

export const register = (data: IRegisterData) => {
	return async (dispatch: AppDispatch) => {
		dispatch(registerRequest());

		try {
			const res = await fetch(`${BASE_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const responseData: IAuthResponse = await checkResponse<IAuthResponse>(
				res
			);

			if (responseData.success) {
				dispatch(
					registerSuccess({
						user: responseData.user,
						accessToken: responseData.accessToken,
						refreshToken: responseData.refreshToken,
					})
				);

				localStorage.setItem('accessToken', responseData.accessToken);
				localStorage.setItem('refreshToken', responseData.refreshToken);
			} else {
				dispatch(registerFailed('Ошибка при регистрации'));
			}
		} catch (error: any) {
			dispatch(registerFailed(error.message || 'Ошибка при регистрации'));
		}
	};
};

export const login = (data: ILoginData) => {
	return async (dispatch: AppDispatch) => {
		dispatch(loginRequest());

		try {
			const res = await fetch(`${BASE_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const responseData: IAuthResponse = await checkResponse<IAuthResponse>(
				res
			);

			if (responseData.success) {
				dispatch(
					loginSuccess({
						user: responseData.user,
						accessToken: responseData.accessToken,
						refreshToken: responseData.refreshToken,
					})
				);

				localStorage.setItem('accessToken', responseData.accessToken);
				localStorage.setItem('refreshToken', responseData.refreshToken);
			} else {
				dispatch(loginFailed('Ошибка при авторизации'));
			}
		} catch (error: any) {
			dispatch(loginFailed(error.message || 'Ошибка при авторизации'));
		}
	};
};

export const logout = () => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		dispatch(logoutRequest());

		const { refreshToken } = getState().auth;

		if (!refreshToken) {
			dispatch(logoutSuccess());

			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			return;
		}

		try {
			const res = await fetch(`${BASE_URL}/auth/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token: refreshToken }),
			});

			const responseData: ILogoutResponse =
				await checkResponse<ILogoutResponse>(res);

			if (responseData.success) {
				dispatch(logoutSuccess());

				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
			} else {
				dispatch(logoutFailed('Ошибка при выходе из системы'));
			}
		} catch (error: any) {
			dispatch(logoutFailed(error.message || 'Ошибка при выходе из системы'));

			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
		}
	};
};

export const updateToken = () => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		dispatch(updateTokenRequest());

		const { refreshToken } = getState().auth;

		if (!refreshToken) {
			dispatch(updateTokenFailed('Нет refresh token'));
			return;
		}

		try {
			const res = await fetch(`${BASE_URL}/auth/token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token: refreshToken }),
			});

			const responseData: IUpdateTokenResponse =
				await checkResponse<IUpdateTokenResponse>(res);

			if (responseData.success) {
				dispatch(
					updateTokenSuccess({
						accessToken: responseData.accessToken,
						refreshToken: responseData.refreshToken,
					})
				);

				localStorage.setItem('accessToken', responseData.accessToken);
				localStorage.setItem('refreshToken', responseData.refreshToken);
			} else {
				dispatch(updateTokenFailed('Ошибка при обновлении токена'));
			}
		} catch (error: any) {
			dispatch(
				updateTokenFailed(error.message || 'Ошибка при обновлении токена')
			);
		}
	};
};

export const getProfile = () => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		dispatch(getProfileRequest());

		const { accessToken } = getState().auth;

		if (!accessToken) {
			dispatch(getProfileFailed('Нет access token'));
			return;
		}

		try {
			const res = await fetch(`${BASE_URL}/auth/user`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: accessToken,
				},
			});

			const responseData: IUserResponse = await checkResponse<IUserResponse>(
				res
			);

			if (responseData.success) {
				dispatch(getProfileSuccess(responseData.user));
			} else {
				dispatch(getProfileFailed('Ошибка при получении профиля'));
			}
		} catch (error: any) {
			dispatch(
				getProfileFailed(error.message || 'Ошибка при получении профиля')
			);
		}
	};
};

export const updateProfile = (data: IUpdateProfileData) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		dispatch(updateProfileRequest());

		const { accessToken } = getState().auth;

		if (!accessToken) {
			dispatch(updateProfileFailed('Нет access token'));
			return;
		}

		try {
			const res = await fetch(`${BASE_URL}/auth/user`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: accessToken,
				},
				body: JSON.stringify(data),
			});

			const responseData: IUserResponse = await checkResponse<IUserResponse>(
				res
			);

			if (responseData.success) {
				dispatch(updateProfileSuccess(responseData.user));
			} else {
				dispatch(updateProfileFailed('Ошибка при обновлении профиля'));
			}
		} catch (error: any) {
			dispatch(
				updateProfileFailed(error.message || 'Ошибка при обновлении профиля')
			);
		}
	};
};

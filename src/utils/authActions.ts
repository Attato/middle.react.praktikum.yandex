import { request } from '../utils/api';

import {
	IRegisterData,
	ILoginData,
	IAuthResponse,
	ILogoutResponse,
	IUpdateTokenResponse,
	IUserResponse,
	IUpdateProfileData,
} from '../services/types/authTypes';

export const register = (data: IRegisterData): Promise<IAuthResponse> => {
	return request('/auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
};

export const login = (data: ILoginData): Promise<IAuthResponse> => {
	return request('/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
};

export const logout = (token: string): Promise<ILogoutResponse> => {
	return request('/auth/logout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ token }),
	});
};

export const updateToken = (token: string): Promise<IUpdateTokenResponse> => {
	return request('/auth/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ token }),
	});
};

export const getProfile = (token: string): Promise<IUserResponse> => {
	return request('/auth/user', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token,
		},
	});
};

export const updateProfile = (
	data: IUpdateProfileData,
	token: string
): Promise<IUserResponse> => {
	return request('/auth/user', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token,
		},
		body: JSON.stringify(data),
	});
};

export const USER_REGISTER_REQUEST: 'USER_REGISTER_REQUEST' =
	'USER_REGISTER_REQUEST';
export const USER_REGISTER_SUCCESS: 'USER_REGISTER_SUCCESS' =
	'USER_REGISTER_SUCCESS';
export const USER_REGISTER_FAILED: 'USER_REGISTER_FAILED' =
	'USER_REGISTER_FAILED';

export const USER_LOGIN_REQUEST: 'USER_LOGIN_REQUEST' = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS' = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILED: 'USER_LOGIN_FAILED' = 'USER_LOGIN_FAILED';

export const USER_LOGOUT_REQUEST: 'USER_LOGOUT_REQUEST' = 'USER_LOGOUT_REQUEST';
export const USER_LOGOUT_SUCCESS: 'USER_LOGOUT_SUCCESS' = 'USER_LOGOUT_SUCCESS';
export const USER_LOGOUT_FAILED: 'USER_LOGOUT_FAILED' = 'USER_LOGOUT_FAILED';

export const USER_UPDATE_TOKEN_REQUEST: 'USER_UPDATE_TOKEN_REQUEST' =
	'USER_UPDATE_TOKEN_REQUEST';
export const USER_UPDATE_TOKEN_SUCCESS: 'USER_UPDATE_TOKEN_SUCCESS' =
	'USER_UPDATE_TOKEN_SUCCESS';
export const USER_UPDATE_TOKEN_FAILED: 'USER_UPDATE_TOKEN_FAILED' =
	'USER_UPDATE_TOKEN_FAILED';

export const USER_UPDATE_PROFILE_REQUEST: 'USER_UPDATE_PROFILE_REQUEST' =
	'USER_UPDATE_PROFILE_REQUEST';
export const USER_UPDATE_PROFILE_SUCCESS: 'USER_UPDATE_PROFILE_SUCCESS' =
	'USER_UPDATE_PROFILE_SUCCESS';
export const USER_UPDATE_PROFILE_FAILED: 'USER_UPDATE_PROFILE_FAILED' =
	'USER_UPDATE_PROFILE_FAILED';

export const USER_GET_PROFILE_REQUEST: 'USER_GET_PROFILE_REQUEST' =
	'USER_GET_PROFILE_REQUEST';
export const USER_GET_PROFILE_SUCCESS: 'USER_GET_PROFILE_SUCCESS' =
	'USER_GET_PROFILE_SUCCESS';
export const USER_GET_PROFILE_FAILED: 'USER_GET_PROFILE_FAILED' =
	'USER_GET_PROFILE_FAILED';

export interface IUser {
	email: string;
	name: string;
}

export interface IAuthState {
	user: IUser | null;
	accessToken: string | null;
	refreshToken: string | null;
	isLoading: boolean;
	error: string | null;
	isAuthenticated: boolean;
}

export interface IRegisterData {
	email: string;
	password: string;
	name: string;
}

export interface ILoginData {
	email: string;
	password: string;
}

export interface IAuthResponse {
	success: boolean;
	user: IUser;
	accessToken: string;
	refreshToken: string;
}

export interface ISuccessResponse {
	success: boolean;
	message?: string;
}

export interface IUpdateTokenResponse {
	success: boolean;
	accessToken: string;
	refreshToken: string;
}

export interface IUpdateTokenData {
	token: string;
}

export interface IUserResponse {
	success: boolean;
	user: IUser;
}

export interface IUpdateProfileData {
	name: string;
	email: string;
	password?: string;
}

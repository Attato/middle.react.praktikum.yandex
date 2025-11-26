import authReducer, {
	clearError,
	setTokens,
	clearTokens,
	initialState,
} from './authSlice';
import { IAuthState, IUser } from '../types/authTypes';

const mockLocalStorage: Storage = {
	getItem: jest.fn(() => null),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
	key: jest.fn(),
	length: 0,
};

beforeAll(() => {
	Object.defineProperty(global, 'localStorage', {
		value: mockLocalStorage,
		writable: true,
	});
});

describe('authSlice', () => {
	test('Должно быть возвращено исходное состояние', () => {
		expect(authReducer(undefined, { type: '@@INIT' })).toEqual(
			expect.objectContaining({
				user: null,
				isLoading: false,
				isAuthenticated: expect.any(Boolean),
			})
		);
	});

	test('clearError должен установить значение error в null', () => {
		const stateWithError: IAuthState = { ...initialState, error: 'error' };
		const result = authReducer(stateWithError, clearError());

		expect(result.error).toBe(null);
	});

	test('setTokens должны устанавливать токены и authenticated в true', () => {
		const result = authReducer(
			initialState,
			setTokens({
				accessToken: '123',
				refreshToken: '456',
			})
		);

		expect(result.accessToken).toBe('123');
		expect(result.refreshToken).toBe('456');
		expect(result.isAuthenticated).toBe(true);
	});

	test('clearTokens должны очищать токены и отменять аутентификацию', () => {
		const mockUser: IUser = {
			name: 'Test User',
			email: 'test@example.com',
		};

		const filledState: IAuthState = {
			...initialState,
			accessToken: 'aaa',
			refreshToken: 'bbb',
			isAuthenticated: true,
			user: mockUser,
		};

		const result = authReducer(filledState, clearTokens());

		expect(result.accessToken).toBe(null);
		expect(result.refreshToken).toBe(null);
		expect(result.user).toBe(null);
		expect(result.isAuthenticated).toBe(false);
	});
});

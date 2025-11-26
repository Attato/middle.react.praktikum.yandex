import reducer, {
	clearOrder,
	restoreOrder,
	createOrder,
	OrderState,
} from './orderSlice';

import { Order } from '../../types';

jest.mock('./ordersSlice', () => ({
	addOrder: jest.fn((order: Order) => ({
		type: 'orders/addOrder',
		payload: order,
	})),
}));

beforeAll(() => {
	Object.defineProperty(global, 'localStorage', {
		value: {
			getItem: jest.fn(() => null),
			setItem: jest.fn(),
			removeItem: jest.fn(),
			clear: jest.fn(),
		},
		writable: true,
	});
});

describe('orderSlice', () => {
	const initialState: OrderState = {
		orderNumber: null,
		loading: false,
		error: null,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('Должно быть возвращено исходное состояние', () => {
		expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
	});

	test('clearOrder должен сбросить состояние и удалить данные из localStorage', () => {
		const state: OrderState = { orderNumber: 123, loading: true, error: 'err' };
		const nextState = reducer(state, clearOrder());

		expect(nextState).toEqual({
			orderNumber: null,
			loading: false,
			error: null,
		});

		expect(localStorage.removeItem).toHaveBeenCalledWith('lastOrderNumber');
	});

	test('restoreOrder должен восстановить номер заказа из localStorage', () => {
		(localStorage.getItem as jest.Mock).mockReturnValue('99876');

		const nextState = reducer(initialState, restoreOrder());

		expect(nextState.orderNumber).toBe(99876);
	});

	test('createOrder.pending должен установить loading = true и очистить error', () => {
		const action = { type: createOrder.pending.type };
		const nextState = reducer(initialState, action);

		expect(nextState.loading).toBe(true);
		expect(nextState.error).toBeNull();
	});

	test('createOrder.fulfilled должен установить orderNumber, loading = false и сохранить в localStorage', () => {
		const action = { type: createOrder.fulfilled.type, payload: 789 };
		const nextState = reducer(initialState, action);

		expect(nextState.orderNumber).toBe(789);
		expect(nextState.loading).toBe(false);
		expect(localStorage.setItem).toHaveBeenCalledWith('lastOrderNumber', '789');
	});

	test('createOrder.rejected должен установить error, loading = false и удалить из localStorage', () => {
		const action = {
			type: createOrder.rejected.type,
			error: { message: 'Failed' },
		};

		const nextState = reducer(initialState, action);

		expect(nextState.loading).toBe(false);
		expect(nextState.error).toBe('Failed');
		expect(localStorage.removeItem).toHaveBeenCalledWith('lastOrderNumber');
	});
});

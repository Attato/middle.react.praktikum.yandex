import reducer, {
	wsConnectionStart,
	wsConnectionSuccess,
	wsConnectionError,
	wsConnectionClosed,
	wsGetMessage,
	addOrder,
	clearOrders,
	saveOrdersToStorage,
	restoreOrdersFromStorage,
	initialState,
	type OrdersResponse,
} from './ordersSlice';

import { Order } from '../../types';

Object.defineProperty(global, 'localStorage', {
	value: {
		getItem: jest.fn(() => null),
		setItem: jest.fn(),
		removeItem: jest.fn(),
		clear: jest.fn(),
	},
	writable: true,
});

describe('ordersSlice', () => {
	const sampleOrder: Order = {
		_id: '1',
		number: 100,
		name: 'Тестовый заказ',
		ingredients: ['йцук', 'qwer'],
		status: 'created',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('Должно быть возвращено исходное состояние', () => {
		expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
	});

	test('wsConnectionStart должен установить loading и isUserOrders', () => {
		const nextState = reducer(
			initialState,
			wsConnectionStart({ withAuth: true, endpoint: '/ws' })
		);

		expect(nextState.loading).toBe(true);
		expect(nextState.wsConnected).toBe(false);
		expect(nextState.isUserOrders).toBe(true);
	});

	test('wsConnectionSuccess должен установить wsConnected = true и loading = false', () => {
		const nextState = reducer(
			{ ...initialState, loading: true },
			wsConnectionSuccess()
		);

		expect(nextState.wsConnected).toBe(true);
		expect(nextState.loading).toBe(false);
	});

	test('wsConnectionError должен установить error и loading = false', () => {
		const nextState = reducer(initialState, wsConnectionError('error'));

		expect(nextState.error).toBe('error');
		expect(nextState.loading).toBe(false);
		expect(nextState.wsConnected).toBe(false);
	});

	test('wsConnectionClosed должен установить wsConnected = false и isUserOrders = false', () => {
		const state = { ...initialState, wsConnected: true, isUserOrders: true };
		const nextState = reducer(state, wsConnectionClosed());

		expect(nextState.wsConnected).toBe(false);
		expect(nextState.isUserOrders).toBe(false);
	});

	test('wsGetMessage должен обновить userOrders и сохранить в localStorage', () => {
		const payload: OrdersResponse = {
			success: true,
			orders: [sampleOrder],
			total: 1,
			totalToday: 1,
		};

		const nextState = reducer(
			{ ...initialState, isUserOrders: true },
			wsGetMessage(payload)
		);
		expect(nextState.userOrders).toEqual([sampleOrder]);

		expect(localStorage.setItem).toHaveBeenCalledWith(
			'userOrders',
			JSON.stringify([sampleOrder])
		);
	});

	test('addOrder добавляет новый заказ и обновляет статистику общих заказов', () => {
		const nextState = reducer(initialState, addOrder(sampleOrder));

		expect(nextState.orders).toEqual([sampleOrder]);
		expect(nextState.userOrders).toEqual([sampleOrder]);
		expect(nextState.total).toBe(1);
		expect(nextState.totalToday).toBe(1);

		expect(localStorage.setItem).toHaveBeenCalledWith(
			'userOrders',
			JSON.stringify([sampleOrder])
		);
	});

	test('clearOrders должен сбросить заказы и удалить из localStorage', () => {
		const state = {
			...initialState,
			orders: [sampleOrder],
			userOrders: [sampleOrder],
			total: 1,
			totalToday: 1,
		};

		const nextState = reducer(state, clearOrders());

		expect(nextState.orders).toEqual([]);
		expect(nextState.userOrders).toEqual([]);
		expect(nextState.total).toBe(0);
		expect(nextState.totalToday).toBe(0);
		expect(localStorage.removeItem).toHaveBeenCalledWith('userOrders');
	});

	test('restoreOrdersFromStorage должен загрузить заказы из localStorage', () => {
		(localStorage.getItem as jest.Mock).mockReturnValue(
			JSON.stringify([sampleOrder])
		);

		const nextState = reducer(initialState, restoreOrdersFromStorage());

		expect(nextState.userOrders).toEqual([sampleOrder]);
	});

	test('saveOrdersToStorage должен сохранить userOrders в localStorage', () => {
		const state = { ...initialState, userOrders: [sampleOrder] };

		reducer(state, saveOrdersToStorage());

		expect(localStorage.setItem).toHaveBeenCalledWith(
			'userOrders',
			JSON.stringify([sampleOrder])
		);
	});
});

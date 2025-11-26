import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../types';

interface OrdersState {
	orders: Order[];
	userOrders: Order[];
	total: number;
	totalToday: number;
	loading: boolean;
	error: string | null;
	wsConnected: boolean;
	isUserOrders: boolean;
}

export interface OrdersResponse {
	success: boolean;
	orders: Order[];
	total: number;
	totalToday: number;
}

interface WSConnectionStartPayload {
	withAuth?: boolean;
	endpoint: string;
}

const loadUserOrdersFromStorage = (): Order[] => {
	try {
		const saved = localStorage.getItem('userOrders');

		if (saved) {
			const orders = JSON.parse(saved);

			return Array.isArray(orders)
				? orders.filter((order) => order && order._id)
				: [];
		}
	} catch (error) {
		console.error('Ошибка загрузки заказов из localStorage:', error);
	}
	return [];
};

const saveUserOrdersToStorage = (orders: Order[]) => {
	try {
		localStorage.setItem('userOrders', JSON.stringify(orders));
	} catch (error) {
		console.error('Ошибка сохранения заказов в localStorage:', error);
	}
};

export const initialState: OrdersState = {
	orders: [],
	userOrders: loadUserOrdersFromStorage(),
	total: 0,
	totalToday: 0,
	loading: false,
	error: null,
	wsConnected: false,
	isUserOrders: false,
};

const ordersSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {
		wsConnectionStart: (
			state,
			action: PayloadAction<WSConnectionStartPayload>
		) => {
			state.wsConnected = false;
			state.loading = true;
			state.error = null;
			state.isUserOrders = action.payload?.withAuth || false;
		},
		wsConnectionSuccess: (state) => {
			state.wsConnected = true;
			state.loading = false;
			state.error = null;
		},
		wsConnectionError: (state, action: PayloadAction<string>) => {
			state.wsConnected = false;
			state.loading = false;
			state.error = action.payload;
		},
		wsConnectionClosed: (state) => {
			state.wsConnected = false;
			state.isUserOrders = false;
		},
		wsGetMessage: (state, action: PayloadAction<OrdersResponse>) => {
			if (state.isUserOrders) {
				state.userOrders = action.payload.orders;

				saveUserOrdersToStorage(action.payload.orders);
			} else {
				state.orders = action.payload.orders;
				state.total = action.payload.total;
				state.totalToday = action.payload.totalToday;
			}
			state.loading = false;
		},
		addOrder: (state, action: PayloadAction<Order>) => {
			const newOrder = action.payload;

			const existingInOrders = state.orders.findIndex(
				(order) => order._id === newOrder._id
			);

			if (existingInOrders === -1) {
				state.orders.unshift(newOrder);
			}

			const existingInUserOrders = state.userOrders.findIndex(
				(order) => order._id === newOrder._id
			);

			if (existingInUserOrders === -1) {
				state.userOrders.unshift(newOrder);

				saveUserOrdersToStorage(state.userOrders);
			}

			state.total += 1;
			state.totalToday += 1;
		},
		clearOrders: (state) => {
			state.orders = [];
			state.userOrders = [];
			state.total = 0;
			state.totalToday = 0;
			state.isUserOrders = false;

			localStorage.removeItem('userOrders');
		},
		saveOrdersToStorage: (state) => {
			saveUserOrdersToStorage(state.userOrders);
		},
		restoreOrdersFromStorage: (state) => {
			state.userOrders = loadUserOrdersFromStorage();
		},
	},
});

export const {
	wsConnectionStart,
	wsConnectionSuccess,
	wsConnectionError,
	wsConnectionClosed,
	wsGetMessage,
	addOrder,
	clearOrders,
	saveOrdersToStorage,
	restoreOrdersFromStorage,
} = ordersSlice.actions;

export default ordersSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IOrder = {
	_id: string;
	number: number;
	name: string;
	ingredients: string[];
	status: 'created' | 'pending' | 'done';
	createdAt: string;
	updatedAt: string;
};

interface OrdersState {
	orders: IOrder[];
	userOrders: IOrder[];
	total: number;
	totalToday: number;
	loading: boolean;
	error: string | null;
	wsConnected: boolean;
	isUserOrders: boolean;
}

interface OrdersResponse {
	success: boolean;
	orders: IOrder[];
	total: number;
	totalToday: number;
}

interface WSConnectionStartPayload {
	withAuth?: boolean;
}

const initialState: OrdersState = {
	orders: [],
	userOrders: [],
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
			} else {
				state.orders = action.payload.orders;
				state.total = action.payload.total;
				state.totalToday = action.payload.totalToday;
			}
			state.loading = false;
		},
		addOrder: (state, action: PayloadAction<IOrder>) => {
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
} = ordersSlice.actions;

export default ordersSlice.reducer;

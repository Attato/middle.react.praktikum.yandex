import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { request } from '../../utils/api';
import { addOrder } from './ordersSlice';
import type { AppDispatch } from '../store';

interface OrderState {
	orderNumber: number | null;
	loading: boolean;
	error: string | null;
}

interface OrderPayload {
	ingredients: string[];
}

interface OrderResponse {
	success: boolean;
	order: {
		number: number;
		_id: string;
		name: string;
		ingredients: string[];
		status: 'created' | 'pending' | 'done';
		createdAt: string;
		updatedAt: string;
	};
}

const initialState: OrderState = {
	orderNumber: null,
	loading: false,
	error: null,
};

export const createOrder = createAsyncThunk<
	number,
	OrderPayload,
	{ dispatch: AppDispatch }
>('order/createOrder', async (payload: OrderPayload, { dispatch }) => {
	const data = await request<OrderResponse>('/orders', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: localStorage.getItem('accessToken') || '',
		},
		body: JSON.stringify(payload),
	});

	const tempOrder = {
		_id: data.order._id,
		number: data.order.number,
		name: data.order.name,
		ingredients: data.order.ingredients,
		status: data.order.status as 'created' | 'pending' | 'done',
		createdAt: data.order.createdAt,
		updatedAt: data.order.updatedAt,
	};

	dispatch(addOrder(tempOrder));

	return data.order.number;
});

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		clearOrder: (state) => {
			state.orderNumber = null;
			state.error = null;
			state.loading = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				createOrder.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.orderNumber = action.payload;
					state.loading = false;
				}
			)
			.addCase(createOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Ошибка отправки заказа';
			});
	},
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;

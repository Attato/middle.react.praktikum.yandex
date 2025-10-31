import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { request } from '../../utils/api';

interface OrderState {
	orderNumber: number | null;
	loading: boolean;
	error: string | null;
}

const initialState: OrderState = {
	orderNumber: null,
	loading: false,
	error: null,
};

interface OrderPayload {
	ingredients: string[];
}

interface OrderResponse {
	success: boolean;
	order: {
		number: number;
	};
}

export const createOrder = createAsyncThunk(
	'order/createOrder',
	async (payload: OrderPayload) => {
		const data = await request<OrderResponse>('/orders', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		return data.order.number;
	}
);

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

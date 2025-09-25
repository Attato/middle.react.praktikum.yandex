import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BASE_URL } from '../../consts';
import { checkResponse } from '../../utils/checkResponse';

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

export const createOrder = createAsyncThunk(
	'order/createOrder',
	async (payload: OrderPayload) => {
		const res = await fetch(`${BASE_URL}/orders`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		const data = await checkResponse<{ order: { number: number } }>(res);
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
				state.error = (action.payload as string) || 'Ошибка отправки заказа';
			});
	},
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;

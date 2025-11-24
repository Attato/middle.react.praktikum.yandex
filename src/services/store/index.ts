import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from '../../services/slices/ingredientsSlice';
import burgerReducer from '../../services/slices/burgerSlice';
import orderReducer from '../../services/slices/orderSlice';
import ordersReducer from '../../services/slices/ordersSlice';
import authReducer from '../../services/slices/authSlice';

import { socketMiddleware } from '../../middleware/socketMiddleware';

export const store = configureStore({
	reducer: {
		ingredients: ingredientsReducer,
		burger: burgerReducer,
		order: orderReducer,
		orders: ordersReducer,
		auth: authReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(socketMiddleware()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

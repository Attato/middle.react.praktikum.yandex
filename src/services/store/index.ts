import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from '../../services/slices/ingredientsSlice';
import burgerReducer from '../../services/slices/burgerSlice';
import orderReducer from '../../services/slices/orderSlice';
import authReducer from '../../services/slices/authSlice';

export const store = configureStore({
	reducer: {
		ingredients: ingredientsReducer,
		burger: burgerReducer,
		order: orderReducer,
		auth: authReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

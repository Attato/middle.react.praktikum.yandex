import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export interface BurgerFilling extends Ingredient {
	uniqueKey: string;
}

export interface BurgerState {
	bun: Ingredient | null;
	fillings: BurgerFilling[];
}

export const initialState: BurgerState = {
	bun: null,
	fillings: [],
};

const burgerSlice = createSlice({
	name: 'burger',
	initialState,
	reducers: {
		addIngredient: (state, action: PayloadAction<Ingredient>) => {
			if (!action.payload) {
				console.error('addIngredient action called without payload');

				return;
			}

			if (action.payload.type === 'bun') {
				state.bun = action.payload;
			} else {
				state.fillings.push({ ...action.payload, uniqueKey: uuidv4() });
			}
		},
		removeFilling: (state, action: PayloadAction<string>) => {
			state.fillings = state.fillings.filter(
				(f) => f.uniqueKey !== action.payload
			);
		},
		clearBurger: (state) => {
			state.bun = null;
			state.fillings = [];
		},
		reorderFillings: (
			state,
			action: PayloadAction<{ fromIndex: number; toIndex: number }>
		) => {
			const { fromIndex, toIndex } = action.payload;
			const updated = [...state.fillings];
			const [removed] = updated.splice(fromIndex, 1);
			updated.splice(toIndex, 0, removed);
			state.fillings = updated;
		},
	},
});

export const { addIngredient, removeFilling, clearBurger, reorderFillings } =
	burgerSlice.actions;
export default burgerSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Ingredient } from '../../types';
import { fetchIngredients as fetchIngredientsAPI } from '../../components/BurgerIngredients/fetchIngredients';

interface IngredientsState {
	items: Ingredient[];
	loading: boolean;
	error: string | null;
}

export const initialState: IngredientsState = {
	items: [],
	loading: false,
	error: null,
};

export const fetchIngredients = createAsyncThunk(
	'ingredients/fetchIngredients',
	fetchIngredientsAPI
);

const ingredientsSlice = createSlice({
	name: 'ingredients',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIngredients.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchIngredients.fulfilled, (state, action) => {
				state.items = action.payload;
				state.loading = false;
			})
			.addCase(fetchIngredients.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Ошибка загрузки';
			});
	},
});

export default ingredientsSlice.reducer;

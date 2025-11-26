import reducer, { fetchIngredients } from './ingredientsSlice';
import { Ingredient } from '../../types';

jest.mock('../../components/BurgerIngredients/fetchIngredients', () => ({
	fetchIngredients: jest.fn(),
}));

describe('ingredientsSlice', () => {
	const initialState = {
		items: [] as Ingredient[],
		loading: false,
		error: null,
	};

	const mockIngredients: Ingredient[] = [
		{
			_id: '1',
			name: 'Булочка 123',
			type: 'bun',
			proteins: 10,
			fat: 5,
			carbohydrates: 20,
			calories: 200,
			price: 100,
			image: 'image.png',
			image_mobile: 'image-mobile.png',
			image_large: 'image-large.png',
			__v: 0,
			uniqueKey: 'key1',
		},
		{
			_id: '2',
			name: 'Соус 123',
			type: 'sauce',
			proteins: 5,
			fat: 2,
			carbohydrates: 10,
			calories: 50,
			price: 50,
			image: 'sauce.png',
			image_mobile: 'sauce-mobile.png',
			image_large: 'sauce-large.png',
			__v: 0,
			uniqueKey: 'key2',
		},
	];

	test('Должно быть возвращено исходное состояние', () => {
		expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
	});

	test('Должен работать fetchIngredients.pending', () => {
		const action = { type: fetchIngredients.pending.type };
		const state = reducer(initialState, action);

		expect(state).toEqual({
			items: [],
			loading: true,
			error: null,
		});
	});

	test('Должен работать fetchIngredients.fulfilled', () => {
		const action = {
			type: fetchIngredients.fulfilled.type,
			payload: mockIngredients,
		};

		const state = reducer(initialState, action);

		expect(state).toEqual({
			items: mockIngredients,
			loading: false,
			error: null,
		});
	});

	test('Должен работать fetchIngredients.rejected', () => {
		const action = {
			type: fetchIngredients.rejected.type,
			error: { message: 'Network Error' },
		};

		const state = reducer(initialState, action);

		expect(state).toEqual({
			items: [],
			loading: false,
			error: 'Network Error',
		});
	});

	test('Должен работать fetchIngredients.rejected без message', () => {
		const action = {
			type: fetchIngredients.rejected.type,
			error: {},
		};

		const state = reducer(initialState, action);

		expect(state).toEqual({
			items: [],
			loading: false,
			error: 'Ошибка загрузки',
		});
	});
});

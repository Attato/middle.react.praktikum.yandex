import burgerReducer, {
	addIngredient,
	removeFilling,
	clearBurger,
	reorderFillings,
} from './burgerSlice';
import { Ingredient } from '../../types';

jest.mock('uuid', () => ({
	v4: () => 'mock-uuid',
}));

const mockIngredient = (overrides: Partial<Ingredient>): Ingredient => ({
	_id: '12345abcdefghijklmnopq',
	name: 'Котлета от бабушки',
	type: 'main',
	proteins: 1000,
	fat: 5,
	carbohydrates: 20,
	calories: 200,
	price: 100,
	image: 'image.png',
	image_mobile: 'image-mobile.png',
	image_large: 'image-large.png',
	__v: 0,
	uniqueKey: '12345678-1234-1234-1234-123456789012',
	...overrides,
});

describe('burgerSlice', () => {
	test('Должно быть возвращено исходное состояние', () => {
		const state = burgerReducer(undefined, { type: '@@INIT' });

		expect(state).toEqual({
			bun: null,
			fillings: [],
		});
	});

	test('addIngredient добавляет булочку, если тип "bun"', () => {
		const bun = mockIngredient({ type: 'bun' });

		const state = burgerReducer(
			{ bun: null, fillings: [] },
			addIngredient(bun)
		);

		expect(state.bun).toEqual(bun);
		expect(state.fillings).toHaveLength(0);
	});

	test('addIngredient добавляет начинку с uuid, если type != bun', () => {
		const filling = mockIngredient({ type: 'main' });

		const state = burgerReducer(
			{ bun: null, fillings: [] },
			addIngredient(filling)
		);

		expect(state.fillings).toHaveLength(1);
		expect(state.fillings[0]).toMatchObject({
			...filling,
			uniqueKey: '12345678-1234-1234-1234-123456789012',
		});
	});

	test('removeFilling удаляет содержимое по uniqueKey', () => {
		const filling1 = mockIngredient({ uniqueKey: 'key1' });
		const filling2 = mockIngredient({ uniqueKey: 'key2' });

		const state = burgerReducer(
			{ bun: null, fillings: [filling1, filling2] },
			removeFilling('key1')
		);

		expect(state.fillings).toEqual([filling2]);
	});

	test('clearBurger сбрасывает булочку и начинку', () => {
		const state = burgerReducer(
			{
				bun: mockIngredient({ type: 'bun' }),
				fillings: [mockIngredient({})],
			},
			clearBurger()
		);

		expect(state).toEqual({
			bun: null,
			fillings: [],
		});
	});

	test('Корректное изменение порядка элементов', () => {
		const a = mockIngredient({ uniqueKey: 'A' });
		const b = mockIngredient({ uniqueKey: 'B' });
		const c = mockIngredient({ uniqueKey: 'C' });

		const state = burgerReducer(
			{ bun: null, fillings: [a, b, c] },
			reorderFillings({ fromIndex: 0, toIndex: 2 })
		);

		expect(state.fillings.map((x) => x.uniqueKey)).toEqual(['B', 'C', 'A']);
	});
});

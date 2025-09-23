import { Ingredient } from '../../types';

export const fetchIngredients = async (): Promise<Ingredient[]> => {
	const response = await fetch(
		'https://norma.nomoreparties.space/api/ingredients'
	);

	if (!response.ok) throw new Error('Ошибка при загрузке данных');

	const data = await response.json();

	return data.data;
};

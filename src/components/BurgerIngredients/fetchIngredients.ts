export interface Ingredient {
	_id: string;
	name: string;
	type: string;
	proteins: number;
	fat: number;
	carbohydrates: number;
	calories: number;
	price: number;
	image: string;
	image_mobile: string;
	image_large: string;
	__v: number;
}

export const fetchIngredients = async (): Promise<Ingredient[]> => {
	const response = await fetch(
		'https://norma.nomoreparties.space/api/ingredients'
	);

	if (!response.ok) throw new Error('Ошибка при загрузке данных');

	const data = await response.json();

	return data.data;
};

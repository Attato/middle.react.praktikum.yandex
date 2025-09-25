import { Ingredient } from '../../types';
import { BASE_URL } from '../../consts';
import { checkResponse } from '../../utils/checkResponse';

export const fetchIngredients = async (): Promise<Ingredient[]> => {
	const res = await fetch(`${BASE_URL}/ingredients`);
	const data = await checkResponse<{ data: Ingredient[] }>(res);

	return data.data;
};

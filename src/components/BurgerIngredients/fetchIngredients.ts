import { Ingredient } from '../../types';

import { request } from '../../utils/api';

export const fetchIngredients = async (): Promise<Ingredient[]> => {
	const data = await request<{ success: boolean; data: Ingredient[] }>(
		'/ingredients'
	);
	return data.data;
};

import { useState, useEffect } from 'react';
import { Ingredient, fetchIngredients } from './fetchIngredients';

export const useIngredients = () => {
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadIngredients = async () => {
			try {
				setLoading(true);
				const data = await fetchIngredients();
				setIngredients(data);
			} catch (err) {
				if (err instanceof Error) setError(err.message);
				else setError('Неизвестная ошибка');
			} finally {
				setLoading(false);
			}
		};

		loadIngredients();
	}, []);

	const buns = ingredients.filter((i) => i.type === 'bun');
	const sauces = ingredients.filter((i) => i.type === 'sauce');
	const mains = ingredients.filter((i) => i.type === 'main');

	return { ingredients, buns, sauces, mains, loading, error };
};

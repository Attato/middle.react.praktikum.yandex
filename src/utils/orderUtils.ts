import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { RootState } from '../services/store';
import { Ingredient } from '../types';

import {
	wsConnectionStart,
	wsConnectionClosed,
} from '../services/slices/ordersSlice';

export const calculateOrderPrice = (
	orderIngredients: string[],
	ingredients: Ingredient[]
): number => {
	if (!ingredients.length) return 0;

	return orderIngredients.reduce((total, ingredientId) => {
		const ingredient = ingredients.find(
			(ing: Ingredient) => ing._id === ingredientId
		);
		return total + (ingredient?.price || 0);
	}, 0);
};

export const getUniqueIngredients = (
	orderIngredients: string[],
	ingredients: Ingredient[]
): (Ingredient & { count: number })[] => {
	const ingredientCounts = orderIngredients.reduce<{ [key: string]: number }>(
		(counts, ingredientId) => {
			counts[ingredientId] = (counts[ingredientId] || 0) + 1;
			return counts;
		},
		{}
	);

	return Object.entries(ingredientCounts)
		.map(([ingredientId, count]) => {
			const ingredient = ingredients.find(
				(ing: Ingredient) => ing._id === ingredientId
			);
			return ingredient
				? {
						...ingredient,
						count,
				  }
				: null;
		})
		.filter(Boolean) as (Ingredient & { count: number })[];
};

export const getOrderStatusInfo = (status: string) => {
	switch (status) {
		case 'done':
			return { text: 'Выполнен' };
		case 'pending':
			return { text: 'Готовится' };
		case 'created':
			return { text: 'Создан' };
		default:
			return { text: status };
	}
};

export const useWebSocketConnection = (withAuth: boolean = false) => {
	const dispatch = useAppDispatch();

	const { wsConnected } = useAppSelector((state: RootState) => state.orders);

	useEffect(() => {
		const endpoint = withAuth ? '/orders' : '/orders/all';

		if (!wsConnected) {
			dispatch(wsConnectionStart({ withAuth, endpoint }));
		}

		return () => {
			if (wsConnected) {
				dispatch(wsConnectionClosed());
			}
		};
	}, [dispatch, withAuth, wsConnected]);
};

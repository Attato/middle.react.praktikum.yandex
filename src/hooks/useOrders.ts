import { useSelector } from 'react-redux';

import { RootState } from '../services/store';

import {
	calculateOrderPrice,
	getUniqueIngredients,
	getOrderStatusInfo,
} from '../utils/orderUtils';

export const useOrders = () => {
	const {
		orders,
		userOrders,
		total,
		totalToday,
		loading,
		error,
		wsConnected,
		isUserOrders,
	} = useSelector((state: RootState) => state.orders);

	const { items: ingredients } = useSelector(
		(state: RootState) => state.ingredients
	);

	const displayOrders = isUserOrders ? userOrders : orders;

	const completedOrders = displayOrders.filter(
		(order) => order.status === 'done'
	);

	const inProgressOrders = displayOrders.filter(
		(order) => order.status === 'pending' || order.status === 'created'
	);

	return {
		orders,
		userOrders,
		displayOrders,
		completedOrders,
		inProgressOrders,
		total,
		totalToday,
		loading,
		error,
		wsConnected,
		isUserOrders,
		ingredients,
		calculateOrderPrice: (orderIngredients: string[]) =>
			calculateOrderPrice(orderIngredients, ingredients),
		getUniqueIngredients: (orderIngredients: string[]) =>
			getUniqueIngredients(orderIngredients, ingredients),
		getOrderStatusInfo,
	};
};

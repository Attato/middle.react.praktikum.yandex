import { ComponentProps } from 'react';

import { Input } from '@ya.praktikum/react-developer-burger-ui-components';

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
	uniqueKey: string;
}

export type Order = {
	_id: string;
	number: number;
	name: string;
	ingredients: string[];
	status: 'created' | 'pending' | 'done';
	createdAt: string;
	updatedAt: string;
};

export type InputProps = Omit<
	ComponentProps<typeof Input>,
	'type' | 'value' | 'onChange'
>;

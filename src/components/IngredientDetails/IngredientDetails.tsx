import React from 'react';

import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../services/hooks';

import { Ingredient } from '../../types';

import styles from './styles.module.css';

const IngredientDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { items } = useAppSelector((state) => state.ingredients);

	const ingredient = items.find((item: Ingredient) => item._id === id);

	if (!ingredient) {
		return (
			<div className={styles.modalContent}>
				<p className="text text_type_main-medium">Ингредиент не найден</p>
			</div>
		);
	}

	const nutrition = [
		{ label: 'Калории, ккал', value: ingredient.calories },
		{ label: 'Белки, г', value: ingredient.proteins },
		{ label: 'Жиры, г', value: ingredient.fat },
		{ label: 'Углеводы, г', value: ingredient.carbohydrates },
	];

	return (
		<div className={styles.modalContent}>
			<img
				src={ingredient.image}
				alt={ingredient.name}
				className={styles.image}
				width={480}
				height={240}
			/>

			<p className="text text_type_main-medium pt-4">{ingredient.name}</p>

			<div className={`mt-8 mb-5 ${styles.nutritionGrid}`}>
				{nutrition.map((item) => (
					<div key={item.label} className={styles.nutritionItem}>
						<p className="text text_type_main-default text_color_inactive">
							{item.label}
						</p>
						<p className="text text_type_digits-default text_color_inactive">
							{item.value}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default IngredientDetails;

import React from 'react';
import { Ingredient } from '../../types';
import styles from './styles.module.css';

interface IngredientDetailsProps {
	ingredient: Ingredient;
}

const IngredientDetails: React.FC<IngredientDetailsProps> = ({
	ingredient,
}) => {
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

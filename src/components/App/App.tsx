import { useState } from 'react';
import AppHeader from '../AppHeader/AppHeader';
import BurgerIngredients from '../BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';

import { v4 as uuidv4 } from 'uuid';

import { Ingredient } from '../../types';

import styles from './styles.module.css';

const App = () => {
	const [bun, setBun] = useState<Ingredient | null>(null);
	const [fillings, setFillings] = useState<Ingredient[]>([]);

	const handleIngredientClick = (ingredient: Ingredient) => {
		if (ingredient.type === 'bun') {
			setBun(ingredient);
		} else {
			setFillings((prev) => [
				...prev,
				{
					...ingredient,
					uniqueKey: uuidv4(),
				},
			]);
		}
	};

	const handleRemoveFilling = (uniqueKey: string) => {
		setFillings((prev) =>
			prev.filter((filling) => filling.uniqueKey !== uniqueKey)
		);
	};

	return (
		<main className="container">
			<AppHeader />

			<div className={styles.content}>
				<div className={styles.section}>
					<BurgerIngredients onIngredientClick={handleIngredientClick} />
				</div>

				<div className={styles.section}>
					<BurgerConstructor
						bun={bun}
						fillings={fillings}
						onRemove={handleRemoveFilling}
					/>
				</div>
			</div>
		</main>
	);
};

export default App;

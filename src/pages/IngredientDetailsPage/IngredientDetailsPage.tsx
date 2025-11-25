import { FC } from 'react';

import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../hooks/hooks';

import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';

import type { Ingredient } from '../../types';

import styles from './styles.module.css';

const IngredientDetailsPage: FC = () => {
	const { id } = useParams<{ id: string }>();
	const { items, loading } = useAppSelector((state) => state.ingredients);
	const ingredient = items.find((item: Ingredient) => item._id === id);

	if (loading) {
		return <div className={styles.container}>Загрузка...</div>;
	}

	if (!ingredient) {
		return <div className={styles.container}>Ингредиент не найден</div>;
	}

	return (
		<main className={styles.container}>
			<div className={styles.content}>
				<h1 className="text text_type_main-large mb-8">Детали ингредиента</h1>

				<IngredientDetails />
			</div>
		</main>
	);
};

export default IngredientDetailsPage;

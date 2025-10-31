import React, { useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

import AppLayout from '../../components/AppLayout/AppLayout';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';

import type { Ingredient } from '../../types';

import styles from './styles.module.css';

const IngredientDetailsPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { items, loading } = useAppSelector((state) => state.ingredients);

	const ingredient = items.find((item: Ingredient) => item._id === id);

	useEffect(() => {
		if (items.length === 0) {
			dispatch(fetchIngredients());
		}
	}, [dispatch, items.length]);

	useEffect(() => {
		if (!loading && items.length > 0 && !ingredient) {
			navigate('/404', { replace: true });
		}
	}, [loading, items, ingredient, navigate]);

	if (loading || items.length === 0) {
		return (
			<AppLayout>
				<div className={styles.container}>
					<div className={styles.loading}>
						<p className="text text_type_main-medium">Загрузка...</p>
					</div>
				</div>
			</AppLayout>
		);
	}

	return (
		<AppLayout>
			<div className={styles.container}>
				<div className={styles.content}>
					<h1 className="text text_type_main-large mb-8">Детали ингредиента</h1>
					<IngredientDetails ingredient={ingredient!} />
				</div>
			</div>
		</AppLayout>
	);
};

export default IngredientDetailsPage;

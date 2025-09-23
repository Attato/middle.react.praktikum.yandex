import { useEffect, useRef, useState } from 'react';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { scrollToSection, getClosestSection } from './scrollToSection';
import { RenderCategory } from './renderCategory';
import type { Ingredient } from '../../types';
import styles from './styles.module.css';

const SECTIONS = [
	{ id: 'buns', label: 'Булки' },
	{ id: 'sauces', label: 'Соусы' },
	{ id: 'mains', label: 'Начинки' },
];

const BurgerIngredients = () => {
	const [current, setCurrent] = useState<string>(SECTIONS[0].id);
	const containerRef = useRef<HTMLDivElement>(null);

	const dispatch = useAppDispatch();
	const { items, loading, error } = useAppSelector(
		(state) => state.ingredients
	);

	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);

	const data: Record<string, Ingredient[]> = {
		buns: items.filter((i) => i.type === 'bun'),
		sauces: items.filter((i) => i.type === 'sauce'),
		mains: items.filter((i) => i.type === 'main'),
	};

	const handleScroll = () => {
		if (!containerRef.current) return;

		setCurrent(
			getClosestSection(
				containerRef.current,
				SECTIONS.map((s) => s.id)
			)
		);
	};

	if (loading) return <div className={styles.container}>Загрузка...</div>;
	if (error) return <div className={styles.container}>Ошибка: {error}</div>;

	return (
		<div className={styles.burgerIngredients}>
			<p className="text text_type_main-large">Соберите бургер</p>

			<div className={styles.tabsContainer}>
				{SECTIONS.map(({ id, label }) => (
					<Tab
						key={id}
						value={id}
						active={current === id}
						onClick={() => scrollToSection(id, setCurrent)}
					>
						{label}
					</Tab>
				))}
			</div>

			<div
				className={styles.ingredientsSection}
				ref={containerRef}
				onScroll={handleScroll}
			>
				{SECTIONS.map(({ id, label }) => (
					<RenderCategory
						key={id}
						id={id}
						title={label}
						items={data[id]}
						onClick={() => {}}
					/>
				))}
			</div>
		</div>
	);
};

export default BurgerIngredients;

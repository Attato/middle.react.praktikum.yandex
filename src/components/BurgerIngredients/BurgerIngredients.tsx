import { useState, useRef } from 'react';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';

import { useIngredients } from './useIngredients';
import { scrollToSection, getClosestSection } from './scrollToSection';
import { RenderCategory } from './renderCategory';

import styles from './styles.module.css';

interface BurgerIngredientsProps {
	onIngredientClick: (ingredient: any) => void;
}

const BurgerIngredients = ({ onIngredientClick }: BurgerIngredientsProps) => {
	const [current, setCurrent] = useState('buns');
	const containerRef = useRef<HTMLDivElement>(null);
	const { buns, sauces, mains, loading, error } = useIngredients();

	const handleScroll = () => {
		if (!containerRef.current) return;
		const closest = getClosestSection(containerRef.current, [
			'buns',
			'sauces',
			'mains',
		]);
		setCurrent(closest);
	};

	if (loading) return <div className={styles.container}>Загрузка...</div>;
	if (error) return <div className={styles.container}>Ошибка: {error}</div>;

	const tabs = [
		{ value: 'buns', label: 'Булки' },
		{ value: 'sauces', label: 'Соусы' },
		{ value: 'mains', label: 'Начинки' },
	];

	return (
		<div className={styles.burgerIngredients}>
			<p className="text text_type_main-large">Соберите бургер</p>

			<div className={styles.tabsContainer}>
				{tabs.map((tab) => (
					<Tab
						key={tab.value}
						value={tab.value}
						active={current === tab.value}
						onClick={() => scrollToSection(tab.value, setCurrent)}
					>
						{tab.label}
					</Tab>
				))}
			</div>

			<div
				className={styles.ingredientsSection}
				ref={containerRef}
				onScroll={handleScroll}
			>
				<RenderCategory
					id="buns"
					title="Булки"
					items={buns}
					onClick={onIngredientClick}
				/>
				<RenderCategory
					id="sauces"
					title="Соусы"
					items={sauces}
					onClick={onIngredientClick}
				/>
				<RenderCategory
					id="mains"
					title="Начинки"
					items={mains}
					onClick={onIngredientClick}
				/>
			</div>
		</div>
	);
};

export default BurgerIngredients;

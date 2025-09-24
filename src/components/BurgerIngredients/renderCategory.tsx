import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import {
	CurrencyIcon,
	Counter,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './styles.module.css';
import type { Ingredient } from '../../types';

interface CategoryProps {
	id: string;
	title: string;
	items: Ingredient[];
	onClick: (item: Ingredient) => void;
	counts: Record<string, number>;
}

const IngredientCard: React.FC<{
	ingredient: Ingredient;
	onClick: () => void;
	count?: number;
}> = ({ ingredient, onClick, count = 0 }) => {
	const ref = useRef<HTMLDivElement>(null);

	const [, dragRef] = useDrag({
		type: 'ingredient',
		item: ingredient,
	});

	dragRef(ref);

	return (
		<div ref={ref} className={styles.ingredientCard} onClick={onClick}>
			{count > 0 && <Counter count={count} size="default" />}
			<img
				src={ingredient.image}
				alt={ingredient.name}
				width={240}
				height={120}
			/>
			<p className={`text text_type_digits-default ${styles.textPrice}`}>
				{ingredient.price} <CurrencyIcon type="primary" />
			</p>
			<p className={`text text_type_main-default ${styles.textName}`}>
				{ingredient.name}
			</p>
		</div>
	);
};

export const RenderCategory: React.FC<CategoryProps> = ({
	id,
	title,
	items,
	onClick,
	counts,
}) => {
	return (
		<div className={styles.categorySection}>
			<h2 id={id} className="text text_type_main-medium">
				{title}
			</h2>
			<div className={styles.ingredientsGrid}>
				{items.map((item) => (
					<IngredientCard
						key={item._id}
						ingredient={item}
						count={counts[item._id] || 0}
						onClick={() => onClick(item)}
					/>
				))}
			</div>
		</div>
	);
};

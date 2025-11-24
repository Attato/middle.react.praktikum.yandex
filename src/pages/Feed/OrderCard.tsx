import { Link, Location } from 'react-router-dom';

import { FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import { type Ingredient } from '../../types';

import styles from './OrderCard.module.css';

interface OrderCardProps {
	order: {
		_id: string;
		number: number;
		createdAt: string;
		name: string;
		ingredients: string[];
		status?: string;
	};
	calculateOrderPrice: (ingredients: string[]) => number;
	ingredients: Ingredient[];
	linkTo: string;
	state?: { background: Location };
}

const OrderCard = ({
	order,
	calculateOrderPrice,
	ingredients,
	linkTo,
	state,
}: OrderCardProps) => {
	const orderPrice = calculateOrderPrice(order.ingredients);

	const renderOrderIngredients = (orderIngredients: string[]) => {
		const ingredientCounts = orderIngredients.reduce<{ [key: string]: number }>(
			(counts, ingredientId) => {
				counts[ingredientId] = (counts[ingredientId] || 0) + 1;
				return counts;
			},
			{}
		);

		const uniqueIngredients = Object.keys(ingredientCounts);
		const maxVisible = 6;
		const shouldShowRemaining = uniqueIngredients.length > maxVisible;
		const remainingCount = uniqueIngredients.length - maxVisible;

		return (
			<div className={styles.ingredientsContainer}>
				{uniqueIngredients.slice(0, maxVisible).map((ingredientId, index) => {
					const ingredient = ingredients.find(
						(ingredient: Ingredient) => ingredient._id === ingredientId
					);

					if (!ingredient) return null;

					const isLastVisible = index === maxVisible - 1;
					const showRemainingOverlay = isLastVisible && shouldShowRemaining;

					return (
						<div
							key={`${ingredientId}-${index}`}
							className={styles.ingredientIcon}
							style={{
								left: `${index * 48}px`,
								zIndex: maxVisible - index,
							}}
						>
							<img
								src={ingredient.image_mobile}
								alt={ingredient.name}
								className={styles.ingredientImage}
							/>

							{showRemainingOverlay && (
								<div className={styles.remainingOverlay}>
									<p className="text text_type_main-default">
										+{remainingCount}
									</p>
								</div>
							)}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<Link to={linkTo} className={styles.orderLink} state={state}>
			<div className={styles.order}>
				<div className={styles.orderTitle}>
					<span className="text text_type_digits-default">#{order.number}</span>
					<span className="text text_type_main-default text_color_inactive">
						<FormattedDate date={new Date(order.createdAt)} />
					</span>
				</div>

				<p className={`text text_type_main-medium ${styles.orderName}`}>
					{order.name}
				</p>

				<div className={styles.orderContent}>
					{renderOrderIngredients(order.ingredients)}

					<div className={styles.orderPrice}>
						<p className="text text_type_digits-default">{orderPrice}</p>
						<CurrencyIcon type="primary" />
					</div>
				</div>
			</div>
		</Link>
	);
};

export default OrderCard;

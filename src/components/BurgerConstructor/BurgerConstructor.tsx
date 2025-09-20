import React, { useState } from 'react';
import {
	ConstructorElement,
	Button,
	CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

import Modal from '../Modal/Modal';
import IngredientDetails from '../IngredientDetails/IngredientDetails';
import OrderDetails from '../OrderDetails/OrderDetails';

import { Ingredient } from '../../types';
import styles from './styles.module.css';

interface Bun {
	name: string;
	price: number;
	image: string;
}

interface BurgerConstructorProps {
	bun: Bun | null;
	fillings: Ingredient[];
	onRemove: (uniqueKey: string) => void;
}

const BurgerConstructor: React.FC<BurgerConstructorProps> = ({
	bun,
	fillings,
	onRemove,
}) => {
	const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
	const [selectedIngredient, setSelectedIngredient] =
		useState<Ingredient | null>(null);

	const totalPrice =
		(bun ? bun.price * 2 : 0) +
		fillings.reduce((sum, item) => sum + item.price, 0);

	const handleOrder = () => setIsOrderModalOpen(true);
	const handleCloseOrderModal = () => setIsOrderModalOpen(false);

	const handleIngredientClick = (ingredient: Ingredient) => {
		setSelectedIngredient(ingredient);
	};
	const handleCloseIngredientModal = () => setSelectedIngredient(null);

	return (
		<div className={styles.wrapper}>
			{bun ? (
				<ConstructorElement
					type="top"
					isLocked
					text={`${bun.name} (верх)`}
					price={bun.price}
					thumbnail={bun.image}
					extraClass={styles.noSelect}
				/>
			) : (
				<div
					className={`constructor-element constructor-element_pos_top ${styles.centerDiv}`}
				>
					Здесь могли бы быть ваши булочки
				</div>
			)}

			<div className={styles.burgerConstructor}>
				{fillings.map((item) => (
					<div
						key={item.uniqueKey}
						className={styles.ingredientWrapper}
						onClick={() => handleIngredientClick(item)}
					>
						<ConstructorElement
							text={item.name}
							price={item.price}
							thumbnail={item.image}
							handleClose={(e?: React.MouseEvent) => {
								e?.stopPropagation();
								onRemove(item.uniqueKey);
							}}
							extraClass={styles.noSelect}
						/>
					</div>
				))}
			</div>

			{bun ? (
				<ConstructorElement
					type="bottom"
					isLocked
					text={`${bun.name} (низ)`}
					price={bun.price}
					thumbnail={bun.image}
					extraClass={`${styles.rotated} ${styles.noSelect}`}
				/>
			) : (
				<div
					className={`constructor-element constructor-element_pos_bottom ${styles.centerDiv}`}
				>
					Здесь могли бы быть ваши булочки
				</div>
			)}

			{totalPrice !== 0 && (
				<div className={styles.orderSection}>
					<div className={styles.totalContainer}>
						<p className="text text_type_digits-medium">{totalPrice}</p>
						<CurrencyIcon type="primary" className={styles.currencyIcon} />
					</div>

					<Button
						htmlType="button"
						type="primary"
						size="large"
						onClick={handleOrder}
					>
						Оформить заказ
					</Button>
				</div>
			)}

			{isOrderModalOpen && (
				<Modal onClose={handleCloseOrderModal}>
					<OrderDetails />
				</Modal>
			)}

			{selectedIngredient && (
				<Modal onClose={handleCloseIngredientModal} title="Детали ингредиента">
					<IngredientDetails ingredient={selectedIngredient} />
				</Modal>
			)}
		</div>
	);
};

export default BurgerConstructor;

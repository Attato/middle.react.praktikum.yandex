import React, { useState, useRef, useEffect } from 'react';
import {
	ConstructorElement,
	Button,
	CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';

import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
	addIngredient,
	removeFilling,
	reorderFillings,
	clearBurger,
} from '../../services/slices/burgerSlice';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';

import FillingItem from './FillingItem';
import Modal from '../Modal/Modal';
import IngredientDetails from '../IngredientDetails/IngredientDetails';
import OrderDetails from '../OrderDetails/OrderDetails';
import type {
	BurgerFilling,
	BurgerState,
} from '../../services/slices/burgerSlice';

import styles from './styles.module.css';

const BurgerConstructor: React.FC = () => {
	const dispatch = useAppDispatch();
	const { bun, fillings } = useAppSelector(
		(state: { burger: BurgerState }) => state.burger
	);
	const { orderNumber, loading } = useAppSelector((state) => state.order);

	const dropTargetRef = useRef<HTMLDivElement>(null);

	const [, drop] = useDrop({
		accept: 'ingredient',
		drop: (item: any) => {
			dispatch(addIngredient(item));
		},
	});

	useEffect(() => {
		if (dropTargetRef.current) {
			drop(dropTargetRef.current);
		}
	}, [drop]);

	const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
	const [selectedIngredient, setSelectedIngredient] =
		useState<BurgerFilling | null>(null);

	const totalPrice =
		(bun ? bun.price * 2 : 0) +
		fillings.reduce((sum, item) => sum + item.price, 0);

	const handleIngredientClick = (ingredient: BurgerFilling) =>
		setSelectedIngredient(ingredient);

	const handleCloseIngredientModal = () => setSelectedIngredient(null);

	const handleOrder = () => {
		if (!bun) return;

		const ingredientIds = [bun._id, ...fillings.map((f) => f._id), bun._id];
		dispatch(createOrder({ ingredients: ingredientIds }));

		setIsOrderModalOpen(true);
	};

	const handleCloseOrderModal = () => {
		setIsOrderModalOpen(false);
		dispatch(clearOrder());
		dispatch(clearBurger());
	};

	const moveItem = (fromIndex: number, toIndex: number) => {
		dispatch(reorderFillings({ fromIndex, toIndex }));
	};

	return (
		<div ref={dropTargetRef} className="mt-25 pl-4 pr-4 pt-5">
			{bun ? (
				<ConstructorElement
					type="top"
					isLocked
					text={`${bun.name} (верх)`}
					price={bun.price}
					thumbnail={bun.image}
					extraClass={`${styles.noSelect} ml-8`}
				/>
			) : (
				<div
					className={`constructor-element constructor-element_pos_top ${styles.centerDiv} ml-8`}
				>
					Здесь могли бы быть ваши булочки
				</div>
			)}

			<div className={styles.burgerConstructor}>
				{fillings.map((item, index) => (
					<FillingItem
						key={item.uniqueKey}
						item={item}
						index={index}
						moveItem={moveItem}
						onRemove={(key) => dispatch(removeFilling(key))}
						onClick={() => handleIngredientClick(item)}
					/>
				))}
			</div>

			{bun ? (
				<ConstructorElement
					type="bottom"
					isLocked
					text={`${bun.name} (низ)`}
					price={bun.price}
					thumbnail={bun.image}
					extraClass={`${styles.rotated} ${styles.noSelect} ml-8`}
				/>
			) : (
				<div
					className={`constructor-element constructor-element_pos_bottom ${styles.centerDiv} ml-8`}
				>
					Здесь могли бы быть ваши булочки
				</div>
			)}

			{totalPrice > 0 && (
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
					{loading ? (
						<p
							className={`${styles.textCenter} text text_type_main-medium pt-30 pb-30`}
						>
							Заказ загружается, подождите немного...
						</p>
					) : (
						<OrderDetails orderNumber={orderNumber} />
					)}
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

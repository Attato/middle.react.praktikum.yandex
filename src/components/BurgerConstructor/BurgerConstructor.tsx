import { useState, useRef, useEffect, FC } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

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
import OrderDetails from '../OrderDetails/OrderDetails';

import type { RootState } from '../../services/store';
import { Ingredient } from '../../types';

import styles from './styles.module.css';

const BurgerConstructor: FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { bun, fillings } = useAppSelector((state: RootState) => state.burger);

	const { orderNumber, loading } = useAppSelector(
		(state: RootState) => state.order
	);
	const { user, isAuthenticated } = useAppSelector(
		(state: RootState) => state.auth
	);

	const dropTargetRef = useRef<HTMLDivElement>(null);

	const [, drop] = useDrop<Ingredient, void, unknown>({
		accept: 'ingredient',
		drop: (item) => {
			dispatch(addIngredient(item));
		},
	});

	useEffect(() => {
		if (dropTargetRef.current) {
			drop(dropTargetRef.current);
		}
	}, [drop]);

	const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

	const totalPrice: number =
		(bun ? bun.price * 2 : 0) +
		fillings.reduce((sum: number, item) => sum + item.price, 0);

	const handleIngredientClick = (ingredient: Ingredient): void => {
		navigate(`/ingredients/${ingredient._id}`, {
			state: { background: location },
		});
	};

	const handleOrder = (): void => {
		if (!bun) return;

		if (!isAuthenticated || !user) {
			const burgerState = {
				bun,
				fillings,
				totalPrice,
			};

			localStorage.setItem('pendingOrder', JSON.stringify(burgerState));

			navigate('/login', {
				state: {
					from: '/',
					message: 'Для оформления заказа необходимо авторизоваться',
				},
			});
			return;
		}

		const ingredientIds: string[] = [
			bun._id,
			...fillings.map((f) => f._id),
			bun._id,
		];

		dispatch(createOrder({ ingredients: ingredientIds }));

		setIsOrderModalOpen(true);
	};

	const handleCloseOrderModal = (): void => {
		setIsOrderModalOpen(false);
		dispatch(clearOrder());
		dispatch(clearBurger());
		localStorage.removeItem('pendingOrder');
	};

	const moveItem = (fromIndex: number, toIndex: number): void => {
		dispatch(reorderFillings({ fromIndex, toIndex }));
	};

	const hasIngredients: boolean = totalPrice > 0;

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
						onRemove={(key: string) => dispatch(removeFilling(key))}
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

			{hasIngredients && (
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
							Заказ загружается, подождите секунд 10-15
						</p>
					) : (
						<OrderDetails orderNumber={orderNumber} />
					)}
				</Modal>
			)}
		</div>
	);
};

export default BurgerConstructor;

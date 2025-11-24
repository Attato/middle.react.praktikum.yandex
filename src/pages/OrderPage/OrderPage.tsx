import { useParams, useLocation } from 'react-router-dom';
import { FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import { useWebSocketConnection } from '../../utils/orderUtils';
import { useOrders } from '../../hooks/useOrders';

import styles from './styles.module.css';

const OrderPage = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();

	const isUserOrderPage = location.pathname.includes('/profile/orders');
	useWebSocketConnection(isUserOrderPage);

	const {
		orders,
		userOrders,
		loading,
		error,
		calculateOrderPrice,
		getUniqueIngredients,
		getOrderStatusInfo,
	} = useOrders();

	const background = location.state?.background;
	const isModal = Boolean(background);

	const order = isUserOrderPage
		? userOrders.find((order) => order._id === id)
		: orders.find((order) => order._id === id);

	if (loading && !order) {
		return <LoadingState message="Загрузка заказа..." />;
	}

	if (error) {
		return <ErrorState message={error} />;
	}

	if (!order) {
		return <ErrorState message="Заказ не найден" />;
	}

	const orderPrice = calculateOrderPrice(order.ingredients);
	const uniqueIngredients = getUniqueIngredients(order.ingredients);
	const statusInfo = getOrderStatusInfo(order.status);

	const content = (
		<OrderContent
			order={order}
			orderPrice={orderPrice}
			uniqueIngredients={uniqueIngredients}
			statusInfo={statusInfo}
			isModal={isModal}
		/>
	);

	if (isModal) {
		return content;
	}

	return <main className={styles.content}>{content}</main>;
};

const LoadingState = ({ message }: { message: string }) => (
	<div className={`${styles.container} ${styles.center}`}>
		<div className="text text_type_main-default mt-20">{message}</div>
	</div>
);

const ErrorState = ({ message }: { message: string }) => (
	<div className={`${styles.container} ${styles.center}`}>
		<div className="text text_type_main-default mt-20 text_color_error">
			{message}
		</div>
	</div>
);

const OrderContent = ({
	order,
	orderPrice,
	uniqueIngredients,
	statusInfo,
	isModal,
}: any) => (
	<div className={isModal ? '' : styles.pageContent}>
		{!isModal && (
			<p className={`text text_type_digits-default ${styles.orderNumber}`}>
				#{order.number}
			</p>
		)}

		<h1
			className={`text text_type_main-medium ${isModal ? '' : 'mt-10'} ${
				styles.orderName
			}`}
		>
			{order.name}
		</h1>

		<p
			className={`text text_type_main-default ${isModal ? 'mt-2' : 'mt-3'} ${
				statusInfo.className || ''
			}`}
		>
			{statusInfo.text}
		</p>

		<OrderIngredients ingredients={uniqueIngredients} isModal={isModal} />

		<OrderFooter
			createdAt={order.createdAt}
			price={orderPrice}
			isModal={isModal}
		/>
	</div>
);

const OrderIngredients = ({ ingredients, isModal }: any) => (
	<div className={`${styles.section} ${isModal ? 'mt-6' : 'mt-10'}`}>
		<p className="text text_type_main-medium">Состав:</p>
		<div
			className={`${styles.ingredientsList} ${
				isModal ? styles.modalIngredientsList : ''
			}`}
		>
			{ingredients.map((ingredient: any) => (
				<IngredientItem key={ingredient._id} ingredient={ingredient} />
			))}
		</div>
	</div>
);

const IngredientItem = ({ ingredient }: any) => (
	<div className={styles.ingredientItem}>
		<div className={styles.ingredientInfo}>
			<div className={styles.ingredientImageContainer}>
				<img
					src={ingredient.image_mobile}
					alt={ingredient.name}
					className={styles.ingredientImage}
				/>
			</div>
			<p className={`text text_type_main-default ${styles.ingredientName}`}>
				{ingredient.name}
			</p>
		</div>

		<div className={styles.ingredientPrice}>
			<span className="text text_type_digits-default">
				{ingredient.count} x {ingredient.price}
			</span>
			<CurrencyIcon type="primary" />
		</div>
	</div>
);

const OrderFooter = ({ createdAt, price, isModal }: any) => (
	<div className={`${styles.footer} ${isModal ? 'mt-6' : 'mt-10'}`}>
		<div className="text text_type_main-default text_color_inactive">
			<FormattedDate date={new Date(createdAt)} />
		</div>

		<div className={styles.totalPrice}>
			<span className="text text_type_digits-default">{price}</span>
			<CurrencyIcon type="primary" />
		</div>
	</div>
);

export default OrderPage;

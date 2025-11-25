import { useLocation } from 'react-router-dom';

import { useWebSocketConnection } from '../../utils/orderUtils';

import { useOrders } from '../../hooks/useOrders';

import OrderCard from '../Feed/OrderCard';

import styles from './styles.module.css';

const ProfileOrders = () => {
	const location = useLocation();
	useWebSocketConnection(true);

	const {
		userOrders,
		loading,
		error,
		wsConnected,
		calculateOrderPrice,
		ingredients,
	} = useOrders();

	const orders =
		Array.isArray(userOrders) && userOrders.length > 0 ? userOrders : [];

	if (loading && orders.length === 0)
		return <LoadingState message="Загрузка заказов..." />;

	if (error && orders.length === 0) return <ErrorState message={error} />;

	if (!wsConnected && orders.length === 0)
		return <LoadingState message="Подключение к серверу..." />;

	return (
		<div className={styles.ordersContainer}>
			{orders.map((order) => (
				<OrderCard
					key={order._id}
					order={order}
					calculateOrderPrice={calculateOrderPrice}
					ingredients={ingredients || []}
					linkTo={`/profile/orders/${order._id}`}
					state={{ background: location }}
				/>
			))}

			{orders.length === 0 && <NoOrders />}
		</div>
	);
};

const LoadingState = ({ message }: { message: string }) => (
	<div className="text text_type_main-default">{message}</div>
);

const ErrorState = ({ message }: { message: string }) => (
	<div className="text text_type_main-default text_color_error">
		Ошибка: {message}
	</div>
);

const NoOrders = () => (
	<div className={styles.noOrders}>
		<p className="text text_type_main-default text_color_inactive">
			У вас пока нет заказов
		</p>
	</div>
);

export default ProfileOrders;

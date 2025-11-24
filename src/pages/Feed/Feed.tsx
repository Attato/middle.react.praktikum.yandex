import { useLocation } from 'react-router-dom';
import { useWebSocketConnection } from '../../utils/orderUtils';
import { useOrders } from '../../hooks/useOrders';
import OrderCard from './OrderCard';
import styles from './styles.module.css';

const Feed = () => {
	const location = useLocation();

	const {
		displayOrders,
		completedOrders,
		inProgressOrders,
		total,
		totalToday,
		loading,
		error,
		wsConnected,
		isUserOrders,
		calculateOrderPrice,
		ingredients,
	} = useOrders();

	useWebSocketConnection(isUserOrders);

	if (loading && displayOrders.length === 0) {
		return <LoadingState message="Загрузка заказов..." />;
	}

	if (error) {
		return <ErrorState message={error} />;
	}

	return (
		<main className={styles.content}>
			<FeedHeader isUserOrders={isUserOrders} />

			{!wsConnected && <ConnectionState />}

			{wsConnected && (
				<FeedContent
					isUserOrders={isUserOrders}
					displayOrders={displayOrders}
					completedOrders={completedOrders}
					inProgressOrders={inProgressOrders}
					total={total}
					totalToday={totalToday}
					calculateOrderPrice={calculateOrderPrice}
					ingredients={ingredients}
					location={location}
				/>
			)}
		</main>
	);
};

const LoadingState = ({ message }: { message: string }) => (
	<div className="text text_type_main-default mt-20">{message}</div>
);

const ErrorState = ({ message }: { message: string }) => (
	<div className="text text_type_main-default mt-20 text_color_error">
		Ошибка: {message}
	</div>
);

const ConnectionState = () => (
	<div className="text text_type_main-default text_color_inactive">
		Подключение к серверу...
	</div>
);

const FeedHeader = ({ isUserOrders }: { isUserOrders: boolean }) => (
	<p className="text text_type_main-large mt-10">
		{isUserOrders ? 'История заказов' : 'Лента заказов'}
	</p>
);

const FeedContent = ({
	isUserOrders,
	displayOrders,
	completedOrders,
	inProgressOrders,
	total,
	totalToday,
	calculateOrderPrice,
	ingredients,
	location,
}: any) => (
	<div className={styles.sectionWrap}>
		<OrdersList
			orders={displayOrders}
			calculateOrderPrice={calculateOrderPrice}
			ingredients={ingredients}
			isUserOrders={isUserOrders}
			location={location}
		/>

		{!isUserOrders && (
			<OrdersStats
				completedOrders={completedOrders}
				inProgressOrders={inProgressOrders}
				total={total}
				totalToday={totalToday}
			/>
		)}
	</div>
);

const OrdersList = ({
	orders,
	calculateOrderPrice,
	ingredients,
	isUserOrders,
	location,
}: any) => (
	<div className={styles.section}>
		{orders.map((order: any) => (
			<OrderCard
				key={order._id}
				order={order}
				calculateOrderPrice={calculateOrderPrice}
				ingredients={ingredients}
				linkTo={
					isUserOrders ? `/profile/orders/${order._id}` : `/feed/${order._id}`
				}
				state={{ background: location }}
			/>
		))}

		{orders.length === 0 && <NoOrders />}
	</div>
);

const NoOrders = () => (
	<div className={styles.noOrders}>
		<p className="text text_type_main-default text_color_inactive">
			Заказов пока нет
		</p>
	</div>
);

const OrdersStats = ({
	completedOrders,
	inProgressOrders,
	total,
	totalToday,
}: any) => (
	<div className={styles.rightSection}>
		<OrdersStatusGrid
			completedOrders={completedOrders}
			inProgressOrders={inProgressOrders}
		/>

		<TotalStats title="Выполнено за всё время:" value={total} />
		<TotalStats title="Выполнено за сегодня:" value={totalToday} />
	</div>
);

const OrdersStatusGrid = ({ completedOrders, inProgressOrders }: any) => (
	<div className={styles.ordersInfo}>
		<OrdersColumn title="Готовы:" orders={completedOrders} isCompleted={true} />
		<OrdersColumn
			title="В работе:"
			orders={inProgressOrders}
			isCompleted={false}
		/>
	</div>
);

const OrdersColumn = ({ title, orders, isCompleted }: any) => (
	<div className={styles.ordersColumn}>
		<p className="text text_type_main-medium mb-6">{title}</p>
		<div className={isCompleted ? styles.completed : styles.inProgress}>
			{orders.slice(0, 10).map((order: any) => (
				<OrderNumber
					key={order._id}
					number={order.number}
					isCompleted={isCompleted}
				/>
			))}
		</div>
	</div>
);

const OrderNumber = ({ number, isCompleted }: any) => (
	<p
		className={`text text_type_digits-default ${
			isCompleted ? styles.completedOrderNumber : ''
		}`}
	>
		{number}
	</p>
);

const TotalStats = ({ title, value }: any) => (
	<div className={styles.totalStats}>
		<p className="text text_type_main-medium">{title}</p>
		<p className={`text text_type_digits-large ${styles.shining}`}>{value}</p>
	</div>
);

export default Feed;

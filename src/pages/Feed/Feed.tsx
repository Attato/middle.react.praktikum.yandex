import { useLocation, Location } from 'react-router-dom';

import { useWebSocketConnection } from '../../utils/orderUtils';

import { useOrders } from '../../hooks/useOrders';

import OrderCard from './OrderCard';

import type { Ingredient, Order } from '../../types';

import styles from './styles.module.css';

interface LoadingStateProps {
	message: string;
}

interface ErrorStateProps {
	message: string;
}

interface OrdersListProps {
	orders: Order[];
	calculateOrderPrice: (ingredients: string[]) => number;
	ingredients: Ingredient[];
	isUserOrders: boolean;
	location: Location;
}

interface OrderNumberProps {
	number: number;
	isCompleted: boolean;
}

interface OrdersColumnProps {
	title: string;
	orders: Order[];
	isCompleted: boolean;
}

interface OrdersStatusGridProps {
	completedOrders: Order[];
	inProgressOrders: Order[];
}

interface TotalStatsProps {
	title: string;
	value: number;
}

interface OrdersStatsProps {
	completedOrders: Order[];
	inProgressOrders: Order[];
	total: number;
	totalToday: number;
}

interface FeedContentProps {
	isUserOrders: boolean;
	displayOrders: Order[];
	completedOrders: Order[];
	inProgressOrders: Order[];
	total: number;
	totalToday: number;
	calculateOrderPrice: (ingredients: string[]) => number;
	ingredients: Ingredient[];
	location: Location;
}

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
			<FeedHeader />

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

const LoadingState = ({ message }: LoadingStateProps) => (
	<div className="text text_type_main-default mt-20">{message}</div>
);

const ErrorState = ({ message }: ErrorStateProps) => (
	<div className="text text_type_main-default mt-20 text_color_error">
		Ошибка: {message}
	</div>
);

const ConnectionState = () => (
	<div className="text text_type_main-default text_color_inactive">
		Подключение к серверу...
	</div>
);

const FeedHeader = () => (
	<p className="text text_type_main-large mt-10">Лента заказов</p>
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
}: FeedContentProps) => (
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
}: OrdersListProps) => (
	<div className={styles.section}>
		{orders.map((order: Order) => (
			<OrderCard
				key={order._id}
				order={order}
				calculateOrderPrice={() => calculateOrderPrice(order.ingredients)}
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
}: OrdersStatsProps) => (
	<div className={styles.rightSection}>
		<OrdersStatusGrid
			completedOrders={completedOrders}
			inProgressOrders={inProgressOrders}
		/>

		<TotalStats title="Выполнено за всё время:" value={total} />
		<TotalStats title="Выполнено за сегодня:" value={totalToday} />
	</div>
);

const OrdersStatusGrid = ({
	completedOrders,
	inProgressOrders,
}: OrdersStatusGridProps) => (
	<div className={styles.ordersInfo}>
		<OrdersColumn title="Готовы:" orders={completedOrders} isCompleted={true} />
		<OrdersColumn
			title="В работе:"
			orders={inProgressOrders}
			isCompleted={false}
		/>
	</div>
);

const OrdersColumn = ({ title, orders, isCompleted }: OrdersColumnProps) => (
	<div className={styles.ordersColumn}>
		<p className="text text_type_main-medium mb-6">{title}</p>
		<div className={isCompleted ? styles.completed : styles.inProgress}>
			{orders.slice(0, 10).map((order: Order) => (
				<OrderNumber
					key={order._id}
					number={order.number}
					isCompleted={isCompleted}
				/>
			))}
		</div>
	</div>
);

const OrderNumber = ({ number, isCompleted }: OrderNumberProps) => (
	<p
		className={`text text_type_digits-default ${
			isCompleted ? styles.completedOrderNumber : ''
		}`}
	>
		{number}
	</p>
);

const TotalStats = ({ title, value }: TotalStatsProps) => (
	<div className={styles.totalStats}>
		<p className="text text_type_main-medium">{title}</p>
		<p className={`text text_type_digits-large ${styles.shining}`}>{value}</p>
	</div>
);

export default Feed;

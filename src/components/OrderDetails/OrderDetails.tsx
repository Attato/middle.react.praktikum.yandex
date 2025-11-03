import { FC } from 'react';
import styles from './styles.module.css';

interface OrderDetailsProps {
	orderNumber: number | null;
}

const OrderDetails: FC<OrderDetailsProps> = ({ orderNumber }) => {
	return (
		<div className={styles.modalContent}>
			<p className={`text text_type_digits-large ${styles.orderId} mt-4`}>
				{orderNumber ?? '---'}
			</p>

			<p className="text text_type_main-medium pt-8">Идентификатор заказа</p>

			<img
				src="/checkmark.svg"
				alt="Заказ подтвержден"
				width={120}
				height={120}
				className="mt-15 mb-15"
			/>

			<p className="text text_type_main-default">Ваш заказ начали готовить</p>

			<p className="text text_type_main-default text_color_inactive pt-2 mb-20">
				Дождитесь готовности на орбитальной станции
			</p>
		</div>
	);
};

export default OrderDetails;

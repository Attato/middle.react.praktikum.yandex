import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './styles.module.css';

interface CategoryProps {
	id: string;
	title: string;
	items: {
		_id: string;
		name: string;
		price: number;
		image: string;
		type?: string;
	}[];
	onClick: (item: any) => void;
}
export const RenderCategory = ({
	id,
	title,
	items,
	onClick,
}: CategoryProps) => (
	<div className={styles.categorySection}>
		<h2 id={id} className="text text_type_main-medium">
			{title}
		</h2>
		<div className={styles.ingredientsGrid}>
			{items.map((item) => (
				<div
					key={item._id}
					className={styles.ingredientCard}
					onClick={() => onClick(item)}
				>
					<img src={item.image} alt={item.name} width={240} height={120} />
					<p className={`text text_type_digits-default ${styles.textPrice}`}>
						{item.price} <CurrencyIcon type="primary" />
					</p>
					<p className={`text text_type_main-default ${styles.textName}`}>
						{item.name}
					</p>
				</div>
			))}
		</div>
	</div>
);

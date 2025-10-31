import AppLayout from '../../components/AppLayout/AppLayout';
import BurgerIngredients from '../../components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../../components/BurgerConstructor/BurgerConstructor';

import styles from './styles.module.css';

const Constructor = () => {
	return (
		<AppLayout>
			<div className={styles.content}>
				<div className={styles.section}>
					<BurgerIngredients />
				</div>

				<div className={styles.section}>
					<BurgerConstructor />
				</div>
			</div>
		</AppLayout>
	);
};

export default Constructor;

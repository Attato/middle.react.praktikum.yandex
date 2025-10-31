import BurgerIngredients from '../../components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../../components/BurgerConstructor/BurgerConstructor';

import styles from './styles.module.css';

const Constructor = () => {
	return (
		<main className={styles.content}>
			<div className={styles.section}>
				<BurgerIngredients />
			</div>

			<div className={styles.section}>
				<BurgerConstructor />
			</div>
		</main>
	);
};

export default Constructor;

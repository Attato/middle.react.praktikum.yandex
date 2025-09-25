import AppHeader from '../AppHeader/AppHeader';
import BurgerIngredients from '../BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';

import styles from './styles.module.css';

const App = () => {
	return (
		<main className="container">
			<AppHeader />

			<div className={styles.content}>
				<div className={styles.section}>
					<BurgerIngredients />
				</div>

				<div className={styles.section}>
					<BurgerConstructor />
				</div>
			</div>
		</main>
	);
};

export default App;

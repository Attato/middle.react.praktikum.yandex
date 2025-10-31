import { Link } from 'react-router-dom';

import AppLayout from '../../components/AppLayout/AppLayout';

import { Button } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './styles.module.css';

const NotFound = () => {
	return (
		<AppLayout>
			<div className={styles.container}>
				<div className={styles.content}>
					<h1 className="text text_type_digits-large">404</h1>

					<p className="text text_type_main-medium">Страница не найдена</p>

					<p className="text text_type_main-default text_color_inactive">
						Извините, запрашиваемая страница не существует.
					</p>

					<div className={styles.button404}>
						<Button htmlType="button" type="primary" size="medium">
							<Link to="/" className={styles.link}>
								Вернуться на главную
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</AppLayout>
	);
};

export default NotFound;

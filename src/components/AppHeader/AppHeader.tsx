import { useState } from 'react';
import { Logo } from '@ya.praktikum/react-developer-burger-ui-components';

import { renderLinks } from './utils/renderLinks';
import { links } from './utils/links';

import styles from './styles.module.css';

const AppHeader = () => {
	const [hovered, setHovered] = useState<string | null>(null);

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className={`${styles.section} ${styles.left}`}>
					{renderLinks({ links, section: 'left', hovered, setHovered })}
				</div>

				<div className={`${styles.section} ${styles.center}`}>
					<a href="/">
						<Logo />
					</a>
				</div>

				<div className={`${styles.section}`}>
					{renderLinks({ links, section: 'right', hovered, setHovered })}
				</div>
			</div>
		</header>
	);
};

export default AppHeader;

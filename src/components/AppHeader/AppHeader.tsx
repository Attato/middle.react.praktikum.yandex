import { useState } from 'react';

import { Link } from 'react-router-dom';

import { Logo } from '@ya.praktikum/react-developer-burger-ui-components';

import { renderLinks } from './utils/renderLinks';
import { links } from './utils/links';

import { useAppSelector } from '../../hooks/hooks';

import styles from './styles.module.css';

const AppHeader = () => {
	const [hovered, setHovered] = useState<string | null>(null);
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	const updatedLinks = links.map((link) => {
		if (link.id === 'profile' && !isAuthenticated) {
			return {
				...link,
				href: '/login',
			};
		}
		return link;
	});

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className={`${styles.section} ${styles.left}`}>
					{renderLinks({
						links: updatedLinks,
						section: 'left',
						hovered,
						setHovered,
					})}
				</div>

				<div className={`${styles.section} ${styles.center}`}>
					<Link to="/">
						<Logo />
					</Link>
				</div>

				<div className={`${styles.section}`}>
					{renderLinks({
						links: updatedLinks,
						section: 'right',
						hovered,
						setHovered,
					})}
				</div>
			</div>
		</header>
	);
};

export default AppHeader;

import React from 'react';
import styles from '../styles.module.css';

export type LinkItem = {
	id: string;
	label: string;
	href: string;
	Icon: React.ComponentType<{ type: 'primary' | 'secondary' }>;
	section: 'left' | 'right';
};

type RenderLinksProps = {
	links: LinkItem[];
	section: 'left' | 'right';
	hovered: string | null;
	setHovered: (id: string | null) => void;
};

export function renderLinks({
	links,
	section,
	hovered,
	setHovered,
}: RenderLinksProps) {
	return links
		.filter((link) => link.section === section)
		.map(({ id, href, label, Icon }) => (
			<a
				key={id}
				href={href}
				onMouseEnter={() => setHovered(id)}
				onMouseLeave={() => setHovered(null)}
				className={`text text_type_main-default ${styles.link} ${
					section === 'right' && styles.right
				}`}
			>
				<Icon type={hovered === id ? 'primary' : 'secondary'} />
				{label}
			</a>
		));
}

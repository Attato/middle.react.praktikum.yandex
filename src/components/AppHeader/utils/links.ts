import {
	BurgerIcon,
	ListIcon,
	ProfileIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

import { LinkItem } from './renderLinks';

export const links: LinkItem[] = [
	{
		id: 'constructor',
		label: 'Конструктор',
		href: '/',
		Icon: BurgerIcon,
		section: 'left',
	},
	{
		id: 'orders',
		label: 'Лента заказов',
		href: '/feed',
		Icon: ListIcon,
		section: 'left',
	},
	{
		id: 'profile',
		label: 'Личный кабинет',
		href: '/profile',
		Icon: ProfileIcon,
		section: 'right',
	},
];

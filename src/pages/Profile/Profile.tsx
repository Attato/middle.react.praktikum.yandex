import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';

import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

import {
	Input,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';

import { InputProps } from '../../types';

import {
	logoutUser,
	updateUserProfile,
	getUserProfile,
} from '../../services/slices/authSlice';

import { useAppDispatch, useAppSelector } from '../../services/hooks';

import styles from './styles.module.css';

interface ProfileUpdateData {
	name: string;
	email: string;
	password?: string;
}

const Profile = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const { user, isLoading, error } = useAppSelector((state) => state.auth);
	const currentPath = location.pathname;

	const links = [
		{ to: '/profile', text: 'Профиль' },
		{ to: '/profile/orders', text: 'История заказов' },
		{ to: '#', text: 'Выход', isLogout: true },
	];

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [isEditingName, setIsEditingName] = useState(false);
	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [isEditingPassword, setIsEditingPassword] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!user) {
			dispatch(getUserProfile());
		}
	}, [dispatch, user]);

	useEffect(() => {
		if (user) {
			setName(user.name || '');
			setEmail(user.email || '');
			setPassword('');

			setHasChanges(false);
		}
	}, [user]);

	useEffect(() => {
		const checkForChanges = () => {
			const nameChanged = name !== (user?.name || '');
			const emailChanged = email !== (user?.email || '');
			const passwordChanged = password !== '';

			return nameChanged || emailChanged || passwordChanged;
		};

		const changes = checkForChanges();
		setHasChanges(changes);
	}, [name, email, password, user]);

	const handleLogout = () => {
		dispatch(logoutUser()).then((result) => {
			if (result?.type === 'auth/logoutSuccess') {
				navigate('/login');
			}
		});
	};

	const onNameIconClick = () => {
		setIsEditingName(true);
		setTimeout(() => nameRef.current?.focus(), 0);
	};

	const onEmailIconClick = () => {
		setIsEditingEmail(true);
		setTimeout(() => emailRef.current?.focus(), 0);
	};

	const onPasswordIconClick = () => {
		setIsEditingPassword(true);
		setTimeout(() => passwordRef.current?.focus(), 0);
	};

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleNameBlur = () => {
		setIsEditingName(false);
	};

	const handleEmailBlur = () => {
		setIsEditingEmail(false);
	};

	const handlePasswordBlur = () => {
		setIsEditingPassword(false);
	};

	const handleCancel = () => {
		setName(user?.name || '');
		setEmail(user?.email || '');
		setPassword('');
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		const updateData: ProfileUpdateData = {
			name,
			email,
		};

		if (password) {
			updateData.password = password;
		}

		dispatch(updateUserProfile(updateData)).then((result) => {
			if (result?.type === 'auth/updateProfileSuccess') {
				setPassword('');
			}
		});
	};

	const renderProfileForm = () => (
		<form onSubmit={handleSubmit}>
			{error && (
				<div className={`${styles.error} mb-6`}>
					<p className="text text_type_main-default">{error}</p>
				</div>
			)}

			<div className={`${styles.inputContainer} mb-6`}>
				<Input
					type={'text'}
					placeholder={'Имя'}
					onChange={handleNameChange}
					icon={'EditIcon'}
					value={name}
					ref={nameRef}
					onIconClick={onNameIconClick}
					onBlur={handleNameBlur}
					disabled={!isEditingName || isLoading}
					{...({} as InputProps)}
				/>
			</div>

			<div className={`${styles.inputContainer} mb-6`}>
				<Input
					type={'email'}
					placeholder={'Логин'}
					onChange={handleEmailChange}
					icon={'EditIcon'}
					value={email}
					ref={emailRef}
					onIconClick={onEmailIconClick}
					onBlur={handleEmailBlur}
					disabled={!isEditingEmail || isLoading}
					{...({} as InputProps)}
				/>
			</div>

			<div className={`${styles.inputContainer} mb-6`}>
				<Input
					type={'password'}
					placeholder={'Пароль'}
					onChange={handlePasswordChange}
					icon={'EditIcon'}
					value={password}
					ref={passwordRef}
					onIconClick={onPasswordIconClick}
					onBlur={handlePasswordBlur}
					disabled={!isEditingPassword || isLoading}
					{...({} as InputProps)}
				/>
			</div>

			{hasChanges && (
				<div className={styles.buttons}>
					<Button
						htmlType="button"
						type="secondary"
						size="medium"
						onClick={handleCancel}
						disabled={isLoading}
					>
						Отмена
					</Button>

					<Button
						htmlType="submit"
						type="primary"
						size="medium"
						disabled={isLoading}
					>
						{isLoading ? 'Сохранение...' : 'Сохранить'}
					</Button>
				</div>
			)}
		</form>
	);

	return (
		<main className={styles.container}>
			<div className={styles.content}>
				<div className={styles.leftSide}>
					{links.map((link) =>
						link.isLogout ? (
							<button
								key="logout"
								type="button"
								onClick={handleLogout}
								className={`text text_type_main-medium text_color_inactive ${styles.logoutButton}`}
							>
								{link.text}
							</button>
						) : (
							<Link
								key={link.to}
								to={link.to}
								className={`text text_type_main-medium ${
									currentPath === link.to
										? styles.activeLink
										: 'text_color_inactive'
								}`}
							>
								{link.text}
							</Link>
						)
					)}

					<p className="text text_type_main-default text_color_inactive mt-20">
						{currentPath === '/profile/orders'
							? 'В этом разделе вы можете просмотреть свою историю заказов'
							: 'В этом разделе вы можете изменить свои персональные данные'}
					</p>
				</div>

				<div className={styles.rightSide}>
					{currentPath === '/profile' ? renderProfileForm() : <Outlet />}
				</div>
			</div>
		</main>
	);
};

export default Profile;

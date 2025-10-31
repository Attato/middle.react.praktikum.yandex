import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
	Button,
	Input,
} from '@ya.praktikum/react-developer-burger-ui-components';

import { loginUser, clearError } from '../../services/slices/authSlice';

import { useAppDispatch, useAppSelector } from '../../services/hooks';

import styles from './styles.module.css';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { isLoading, error, isAuthenticated } = useAppSelector(
		(state) => state.auth
	);

	const passwordRef = useRef<HTMLInputElement>(null);

	const from = location.state?.from?.pathname || '/profile';

	useEffect(() => {
		if (isAuthenticated) {
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, navigate, from]);

	useEffect(() => {
		dispatch(clearError());
	}, [dispatch]);

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const onPasswordIconClick = () => {
		setIsPasswordVisible(!isPasswordVisible);
		setTimeout(() => passwordRef.current?.focus(), 0);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		dispatch(loginUser({ email, password }));
	};

	return (
		<main className={styles.container}>
			<form className={styles.content} onSubmit={handleSubmit}>
				<h2 className="text text_type_main-medium mb-6">Вход</h2>

				{error && (
					<div className={`${styles.error} mb-6`}>
						<p className="text text_type_main-default">{error}</p>
					</div>
				)}

				<div className={`${styles.inputContainer} mb-6`}>
					<Input
						type={'email'}
						placeholder={'E-mail'}
						onChange={handleEmailChange}
						value={email}
						name={'email'}
						error={false}
						errorText={'Ошибка'}
						size={'default'}
						required
						disabled={isLoading}
						{...({} as any)}
					/>
				</div>

				<div className={`${styles.inputContainer} mb-6`}>
					<Input
						type={isPasswordVisible ? 'text' : 'password'}
						placeholder={'Пароль'}
						onChange={handlePasswordChange}
						icon={isPasswordVisible ? 'HideIcon' : 'ShowIcon'}
						value={password}
						ref={passwordRef}
						onIconClick={onPasswordIconClick}
						name={'password'}
						error={false}
						errorText={'Ошибка'}
						size={'default'}
						required
						disabled={isLoading}
						{...({} as any)}
					/>
				</div>

				<Button
					htmlType="submit"
					type="primary"
					size="medium"
					disabled={isLoading}
				>
					{isLoading ? 'Вход...' : 'Войти'}
				</Button>

				<div className={styles.authLinks}>
					<div className={styles.authItem}>
						<p className="text text_type_main-default text_color_inactive">
							Вы — новый пользователь?
						</p>

						<Button
							htmlType="button"
							type="secondary"
							size="medium"
							style={{ padding: 0 }}
						>
							<Link to="/register">Зарегистрироваться</Link>
						</Button>
					</div>

					<div className={styles.authItem}>
						<p className="text text_type_main-default text_color_inactive">
							Забыли пароль?
						</p>

						<Button
							htmlType="button"
							type="secondary"
							size="medium"
							style={{ padding: 0 }}
						>
							<Link to="/forgot-password">Восстановить пароль</Link>
						</Button>
					</div>
				</div>
			</form>
		</main>
	);
};

export default Login;

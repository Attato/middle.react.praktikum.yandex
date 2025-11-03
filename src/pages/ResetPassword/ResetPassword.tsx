import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import {
	Button,
	Input,
} from '@ya.praktikum/react-developer-burger-ui-components';

import { InputProps } from '../../types';

import { ISuccessResponse } from '../../services/types/authTypes';

import { request } from '../../utils/api';

import styles from './styles.module.css';

const ResetPassword = () => {
	const [password, setPassword] = useState('');
	const [token, setToken] = useState('');
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const passwordRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const resetAllowed = localStorage.getItem('resetPasswordAllowed');
		if (!resetAllowed) {
			navigate('/forgot-password', { replace: true });
		}
	}, [navigate]);

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		setError('');
	};

	const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
		setToken(e.target.value);
		setError('');
	};

	const onPasswordIconClick = () => {
		setIsPasswordVisible(!isPasswordVisible);
		setTimeout(() => passwordRef.current?.focus(), 0);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (password.length < 6) {
			setError('Пароль должен содержать не менее 6 символов');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const data = await request<ISuccessResponse>('/password-reset', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password, token }),
			});

			if (data.success) {
				localStorage.removeItem('resetPasswordAllowed');
				navigate('/login', {
					replace: true,
					state: { message: 'Пароль успешно изменен' },
				});
			} else {
				setError(data.message || 'Произошла ошибка при сбросе пароля');
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('Ошибка сети. Попробуйте еще раз.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className={styles.container}>
			<div className={styles.content}>
				<h2 className="text text_type_main-medium mb-6">
					Восстановление пароля
				</h2>

				{error && (
					<div className={`${styles.error} mb-6`}>
						<p className="text text_type_main-default">{error}</p>
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className={`${styles.inputContainer} mb-6`}>
						<Input
							type={isPasswordVisible ? 'text' : 'password'}
							placeholder={'Введите новый пароль'}
							onChange={handlePasswordChange}
							icon={isPasswordVisible ? 'HideIcon' : 'ShowIcon'}
							value={password}
							ref={passwordRef}
							onIconClick={onPasswordIconClick}
							name={'password'}
							error={false}
							errorText={''}
							size={'default'}
							disabled={isLoading}
							{...({} as InputProps)}
						/>
					</div>

					<div className={`${styles.inputContainer} mb-6`}>
						<Input
							type={'text'}
							placeholder={'Введите код из письма'}
							onChange={handleTokenChange}
							value={token}
							name={'token'}
							error={false}
							errorText={''}
							size={'default'}
							disabled={isLoading}
							{...({} as InputProps)}
						/>
					</div>

					<Button
						htmlType="submit"
						type="primary"
						size="medium"
						disabled={isLoading || !password || !token}
					>
						{isLoading ? 'Сохранение...' : 'Сохранить'}
					</Button>
				</form>

				<div className={`${styles.authLinks} mt-20`}>
					<div className={styles.authItem}>
						<p className="text text_type_main-default text_color_inactive">
							Вспомнили пароль?
						</p>

						<Link to="/profile" className={styles.link}>
							<Button
								htmlType="button"
								type="secondary"
								size="medium"
								style={{ padding: 0 }}
							>
								Войти
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ResetPassword;

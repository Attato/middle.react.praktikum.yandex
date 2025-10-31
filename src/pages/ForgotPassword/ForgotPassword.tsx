import { useState, ChangeEvent, FormEvent } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import {
	Button,
	Input,
} from '@ya.praktikum/react-developer-burger-ui-components';

import AppLayout from '../../components/AppLayout/AppLayout';

import { BASE_URL } from '../../consts';

import { checkResponse } from '../../utils/checkResponse';

import styles from './styles.module.css';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const navigate = useNavigate();

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		setError('');
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(`${BASE_URL}/password-reset`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			const data = await checkResponse<{ success: boolean; message?: string }>(
				response
			);

			if (data.success) {
				localStorage.setItem('resetPasswordAllowed', 'true');
				navigate('/reset-password');
			} else {
				setError(data.message || 'Произошла ошибка при отправке email');
			}
		} catch (err) {
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
		<AppLayout>
			<div className={styles.container}>
				<div className={styles.content}>
					<h2 className="text text_type_main-medium mb-6">
						Восстановление пароля
					</h2>

					<form onSubmit={handleSubmit}>
						<div className={`${styles.inputContainer} mb-6`}>
							<Input
								type={'email'}
								placeholder={'Укажите e-mail'}
								onChange={handleEmailChange}
								value={email}
								name={'email'}
								error={!!error}
								errorText={error}
								size={'default'}
								disabled={isLoading}
								{...({} as any)}
							/>
						</div>

						<Button
							htmlType="submit"
							type="primary"
							size="medium"
							disabled={isLoading || !email}
						>
							{isLoading ? 'Отправка...' : 'Восстановить'}
						</Button>
					</form>

					<div className={`${styles.authLinks} mt-20`}>
						<div className={styles.authItem}>
							<p className="text text_type_main-default text_color_inactive">
								Вспомнили пароль?
							</p>
							<Link to="/login" className={styles.link}>
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
			</div>
		</AppLayout>
	);
};

export default ForgotPassword;

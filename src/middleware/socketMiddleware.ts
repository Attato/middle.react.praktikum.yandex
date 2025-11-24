import { Middleware } from '@reduxjs/toolkit';

import {
	wsConnectionStart,
	wsConnectionSuccess,
	wsConnectionError,
	wsConnectionClosed,
	wsGetMessage,
} from '../services/slices/ordersSlice';

const WS_URL = 'wss://norma.education-services.ru';

export const socketMiddleware = (): Middleware => {
	return (store) => {
		let socket: WebSocket | null = null;

		return (next) => (action: any) => {
			const { dispatch, getState } = store;

			if (wsConnectionStart.match(action)) {
				const state = getState() as any;
				const { auth } = state;

				const accessToken = auth.accessToken;

				let url: string;

				if (accessToken && action.payload?.withAuth) {
					const token = accessToken.replace('Bearer ', '');
					url = `${WS_URL}/orders?token=${token}`;
				} else {
					url = `${WS_URL}/orders/all`;
				}

				try {
					socket = new WebSocket(url);

					socket.onopen = () => {
						console.log('WebSocket подключен');
						dispatch(wsConnectionSuccess());
					};

					socket.onerror = () => {
						console.error('WebSocket ошибка');
						dispatch(wsConnectionError('WebSocket connection failed'));
					};

					socket.onmessage = (event) => {
						try {
							const { data } = event;
							const parsedData = JSON.parse(data);

							dispatch(wsGetMessage(parsedData));
						} catch (parseError) {
							console.error('Ошибка получения данных:', parseError);
						}
					};

					socket.onclose = (event) => {
						console.log('WebSocket закрыт: ', event.code);
						dispatch(wsConnectionClosed());
					};
				} catch (error) {
					console.error('Ошибка создания WebSocket:', error);
					dispatch(wsConnectionError('Failed to create WebSocket'));
				}
			}

			next(action);
		};
	};
};

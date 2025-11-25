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

		return (next) => (action) => {
			const { dispatch, getState } = store;

			if (wsConnectionStart.match(action)) {
				const state = getState();
				const { auth } = state;

				const accessToken = auth.accessToken;
				const withAuth = action.payload?.withAuth || false;
				const endpoint = action.payload.endpoint;

				let url: string;

				if (accessToken && withAuth) {
					const token = accessToken.replace('Bearer ', '');

					url = `${WS_URL}${endpoint}?token=${token}`;
				} else {
					url = `${WS_URL}${endpoint}`;
				}

				try {
					socket = new WebSocket(url);

					socket.onopen = () => {
						console.log('WebSocket подключен к:', url);
						dispatch(wsConnectionSuccess());
					};

					socket.onerror = (error) => {
						console.error('WebSocket ошибка:', error);
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
						console.log('WebSocket закрыт: ', event.code, event.reason);
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

import { BASE_URL } from '../consts';

async function checkResponse<T>(res: Response): Promise<T> {
	if (!res.ok) {
		const errorData = await res.json().catch(() => null);
		throw new Error(errorData?.message || `Ошибка ${res.status}`);
	}
	return res.json();
}

const checkSuccess = <T>(res: any): T => {
	if (res && res.success) {
		return res;
	}
	throw new Error(`Ответ не success: ${res}`);
};

export const request = <T>(
	endpoint: string,
	options?: RequestInit
): Promise<T> => {
	return fetch(`${BASE_URL}${endpoint}`, options)
		.then((res) => checkResponse<T>(res))
		.then((data) => checkSuccess<T>(data));
};

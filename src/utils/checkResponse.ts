export async function checkResponse<T>(res: Response): Promise<T> {
	if (!res.ok) {
		const errorData = await res.json().catch(() => null);
		throw new Error(errorData?.message || `Ошибка ${res.status}`);
	}
	return res.json();
}

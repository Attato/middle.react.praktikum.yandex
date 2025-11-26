Object.defineProperty(global, 'localStorage', {
	value: {
		getItem: jest.fn(() => null),
		setItem: jest.fn(),
		removeItem: jest.fn(),
		clear: jest.fn(),
	},
	writable: true,
});

import { createInitVariableFromEnv, initVariableEnvMapping } from '../config/initVariableEnv'

describe('createInitVariableFromEnv()', () => {
	it('берёт первое непустое значение из списка ENV-ключей', () => {
		const params = createInitVariableFromEnv({
			APP_URL: '',
			VITE_APP_URL: 'https://vite.example.com',
			REAL_APP_URL: 'https://real.example.com',
			VITE_ACCESS_KEY: 'vite-token',
			MODE: 'development'
		})

		expect(params.APP_URL).toBe('https://vite.example.com')
		expect(params.ACCESS_KEY).toBe('vite-token')
		expect(params.MODE).toBe('development')
	})

	it('поддерживает пользовательскую таблицу соответствий', () => {
		const params = createInitVariableFromEnv(
			{PRIMARY_URL: '', SECONDARY_URL: 'https://custom.example.com'},
			{...initVariableEnvMapping, APP_URL: ['PRIMARY_URL', 'SECONDARY_URL']}
		)

		expect(params.APP_URL).toBe('https://custom.example.com')
	})

	it('преобразует boolean ENV-значения', () => {
		const params = createInitVariableFromEnv({
			USER_ADMIN: 'true',
			USER_LICENSED: '0',
			USER_CONCURRENT_LICENSED: 'yes'
		})

		expect(params.USER_ADMIN).toBe(true)
		expect(params.USER_LICENSED).toBe(false)
		expect(params.USER_CONCURRENT_LICENSED).toBe(true)
	})
})
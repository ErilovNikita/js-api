import { deepMergeJsApi } from '../core/deepMerge'
import initializeJsApi from '../api/initialize'
import { InitVariable } from '../core/classes'
import { PartialJsApi } from '../types'

describe('Функция deepMergeJsApi()', () => {
	/**
	 * Определяем функции отдельно, чтобы после объединения тестовых jsApi,
	 * они ссылались на одни и те же функции
	 */
	function cancel () {}

	function getCurrentLocale () {
		return 'ru'
	}

	function getType () {
		return "objectCard"
	}

	function getValues () {
		return Promise.resolve({})
	}

	function isAddForm () {
		return false
	}

	function isEditForm () {
		return false
	}

	function isModal () {
		return false
	}

	const firstJsApi: PartialJsApi = {
		forms: {
			cancel,
			getType,
			getValues
		},
		isAddForm,
		isEditForm
	}
	const secondJsApi: PartialJsApi = {
		forms: {
			isModal
		},
		getCurrentLocale
	}
	const fullJsApi: PartialJsApi = {
		forms: {
			cancel,
			getType,
			getValues,
			isModal
		},
		getCurrentLocale,
		isAddForm,
		isEditForm
	}

	it('Возвращает глубокое объединение двух объектов jsApi', () => {
		expect(deepMergeJsApi<PartialJsApi>(firstJsApi, secondJsApi) == fullJsApi)
	})
})

describe('Функция jsApi.getAppBaseUrl()', () => {
	const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    initializeJsApi( {}, new InitVariable('development','','','','') )

	it('Вызывает alert и возвращает пустую строку, если ссылка на приложение не назначена', () => {
		window.jsApi.constants.APP_URL = ''
		const appBaseUrl = window.jsApi.getAppBaseUrl()

		expect(alertSpy).toHaveBeenCalledWith('Ссылка на приложение не передана или имеет неверный формат')
		expect(appBaseUrl).toBe('')
	})

	it('Вызывает alert и возвращает пустую строку, если ссылка на приложение имеет неверный формат', () => {
		window.jsApi.constants.APP_URL = 'not link'

		const appBaseUrl = window.jsApi.getAppBaseUrl()

		expect(alertSpy).toHaveBeenCalledWith('Ссылка на приложение не передана или имеет неверный формат')
		expect(appBaseUrl).toBe('')
	})

	it('Возвращает ссылку на приложение, если передана ссылка с слэшем в конце', () => {
		window.jsApi.constants.APP_URL = 'https://domain.ru/'

		expect(window.jsApi.getAppBaseUrl()).toBe('https://domain.ru/sd/')
	})

	it('Возвращает ссылку на приложение, если передана ссылка без слэша в конце', () => {
		window.jsApi.constants.APP_URL = 'https://domain.ru'

		expect(window.jsApi.getAppBaseUrl()).toBe('https://domain.ru/sd/')
	})
})
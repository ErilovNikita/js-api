import {deepMergeJsApi} from '../core/deepMerge'
import {InitVariable} from '../core/classes'
import jsApi from './jsApi'
import type {PartialJsApi} from '../types'
import {createInitVariableFromEnv} from '../config/initVariableEnv'

	async function initializeJsApi<T>(mock: PartialJsApi & T = {} as PartialJsApi & T, params: InitVariable | null = null) {
	const resolvedParams = params || createInitVariableFromEnv()
	const injectJsApi = window.parent.injectJsApi

	if (resolvedParams.MODE === 'production' && typeof injectJsApi === 'function') {
		await window.parent.injectJsApi(window.parent, window)
	} else {
		if (resolvedParams.MODE === 'production' && params) {
			throw new Error('Production jsApi недоступен: window.parent.injectJsApi не найден')
		}

		window.jsApi = deepMergeJsApi(jsApi, mock, resolvedParams)
		window.jsApi.requests.json = window.jsApi.requests.json.bind(window.jsApi)
		window.jsApi.requests.make = window.jsApi.requests.make.bind(window.jsApi)
	}
	return window.jsApi
}

export default initializeJsApi
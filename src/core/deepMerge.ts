import type {IJsApi} from '../types/jsApi'
import type {PartialJsApi} from '../types'
import type {InitVariable} from './classes'

export const deepMergeJsApi = <T>(
	firstJsApi: PartialJsApi,
	secondJsApi: PartialJsApi,
	constants: InitVariable | Record<string, never> = {}
): T => {
	const result: Record<string, unknown> = {...firstJsApi}
	Object.keys(secondJsApi).forEach(key => {
		const value = secondJsApi[key as keyof PartialJsApi]
		if (value && typeof value === 'object') {
			const firstValue = firstJsApi[key as keyof PartialJsApi]
			result[key] = deepMergeJsApi(firstValue as PartialJsApi, value as PartialJsApi)
		} else result[key] = value
	})
	result.constants = constants
	return result as T
}

export const deepMergeActualJsApi = (jsApi: IJsApi, mock: PartialJsApi, constants?: InitVariable): IJsApi =>
	deepMergeJsApi<IJsApi>(jsApi, mock, constants)

export const deepMergeDevJsApi = <T extends IJsApi>(jsApi: T, mock: PartialJsApi, constants?: InitVariable): T =>
	deepMergeJsApi<T>(jsApi, mock, constants)
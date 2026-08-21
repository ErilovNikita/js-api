import initializeJsApi from './api/initialize'
import {InitVariable} from './core/classes'
import type {IJsApi} from './types/jsApi'
export {
	createInitVariableFromEnv,
	initVariableEnvMapping,
	type Environment,
	type InitVariableEnvMapping
} from './config/initVariableEnv'

declare global {
	interface Window {
		jsApi: IJsApi
		injectJsApi(parent: Window, window: Window): Promise<void>
	}
}

export {initializeJsApi, InitVariable}
export * from './types'
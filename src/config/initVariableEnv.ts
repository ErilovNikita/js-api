import {InitVariable} from '../core/classes'

export type Environment = Record<string, string | undefined>

export type InitVariableEnvMapping = {
	[Property in keyof InitVariable]-?: readonly string[]
}

export const initVariableEnvMapping: InitVariableEnvMapping = {
	MODE: ['MODE', 'NODE_ENV'],
	ACCESS_KEY: ['ACCESS_KEY', 'VITE_ACCESS_KEY'],
	APP_URL: ['APP_URL', 'VITE_APP_URL', 'REAL_APP_URL'],
	APP_CODE: ['APP_CODE', 'VITE_APP_CODE'],
	REST_PATH: ['REST_PATH', 'VITE_REST_PATH'],
	SUBJECT_UUID: ['SUBJECT_UUID', 'VITE_SUBJECT_UUID'],
	USER_LOGIN: ['USER_LOGIN', 'VITE_USER_LOGIN'],
	USER_UUID: ['USER_UUID', 'VITE_USER_UUID'],
	USER_ADMIN: ['USER_ADMIN', 'VITE_USER_ADMIN'],
	USER_LICENSED: ['USER_LICENSED', 'VITE_USER_LICENSED'],
	USER_CONCURRENT_LICENSED: ['USER_CONCURRENT_LICENSED', 'VITE_USER_CONCURRENT_LICENSED'],
	USER_TITLE: ['USER_TITLE', 'VITE_USER_TITLE'],
	USER_PROFILES: ['USER_PROFILES', 'VITE_USER_PROFILES'],
	USER_ROLES: ['USER_ROLES', 'VITE_USER_ROLES']
}

function getRuntimeEnvironment(): Environment {
	const runtime = globalThis as typeof globalThis & {
		process?: {env?: Environment}
	}

	return runtime.process?.env || {}
}

function getFirstEnvironmentValue(keys: readonly string[], environment: Environment): string | undefined {
	return keys
		.map(key => environment[key])
		.find(value => value !== undefined && value !== '')
}

function parseBoolean(value: string | undefined): boolean | undefined {
	if (value === undefined) return undefined
	return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

export function createInitVariableFromEnv(
	environment: Environment = getRuntimeEnvironment(),
	mapping: InitVariableEnvMapping = initVariableEnvMapping
): InitVariable {
	const values = Object.fromEntries(
		(Object.keys(mapping) as Array<keyof InitVariable>).map(property => [
			property,
			getFirstEnvironmentValue(mapping[property], environment)
		])
	) as Partial<Record<keyof InitVariable, string>>

	return new InitVariable(
		values.MODE || 'production',
		values.ACCESS_KEY || '',
		values.APP_URL || '',
		values.APP_CODE || '',
		values.REST_PATH || '',
		values.SUBJECT_UUID,
		values.USER_LOGIN,
		values.USER_UUID,
		parseBoolean(values.USER_ADMIN),
		parseBoolean(values.USER_LICENSED),
		parseBoolean(values.USER_CONCURRENT_LICENSED),
		values.USER_TITLE,
		values.USER_PROFILES,
		values.USER_ROLES
	)
}
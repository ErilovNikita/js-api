import type {
	DialogButton,
	DialogResolveResult,
	EventActionResolveResult
} from '../types/classes'

export class InitVariable {
	MODE: string
	ACCESS_KEY: string
	APP_URL: string
	APP_CODE: string
	REST_PATH: string
	SUBJECT_UUID?: string
	USER_LOGIN?: string
	USER_UUID?: string
	USER_ADMIN?: boolean
	USER_LICENSED?: boolean
	USER_CONCURRENT_LICENSED?: boolean
	USER_TITLE?: string
	USER_PROFILES?: string
	USER_ROLES?: string

	constructor(
		MODE: string,
		ACCESS_KEY: string,
		APP_URL: string,
		APP_CODE: string,
		REST_PATH: string,
		SUBJECT_UUID?: string,
		USER_LOGIN?: string,
		USER_UUID?: string,
		USER_ADMIN?: boolean,
		USER_LICENSED?: boolean,
		USER_CONCURRENT_LICENSED?: boolean,
		USER_TITLE?: string,
		USER_PROFILES?: string,
		USER_ROLES?: string
	) {
		this.MODE = MODE
		this.ACCESS_KEY = ACCESS_KEY
		this.APP_URL = APP_URL
		this.APP_CODE = APP_CODE
		this.REST_PATH = REST_PATH
		this.SUBJECT_UUID = SUBJECT_UUID
		this.USER_LOGIN = USER_LOGIN
		this.USER_UUID = USER_UUID
		this.USER_ADMIN = USER_ADMIN
		this.USER_LICENSED = USER_LICENSED
		this.USER_CONCURRENT_LICENSED = USER_CONCURRENT_LICENSED
		this.USER_TITLE = USER_TITLE
		this.USER_PROFILES = USER_PROFILES
		this.USER_ROLES = USER_ROLES
	}
}

export class DialogBuilder {
	title: string | null = null
	content: string
	buttons: Partial<Record<Exclude<DialogButton, 'ok'>, string>> = {}

	constructor(content: string) { this.content = content; }
	addYesButton(title?: string): DialogBuilder { this.buttons.yes = title || 'Да'; return this; }
	addNoButton(title?: string): DialogBuilder { this.buttons.no = title || 'Нет'; return this; }
	addCancelButton(title?: string): DialogBuilder { this.buttons.cancel = title || 'Отмена'; return this; }
	setTitle(title: string): DialogBuilder { this.title = title; return this; }

	async show(): Promise<DialogResolveResult> {
		let content = `title: ${this.title},\ncontent: ${this.content},\n`
		let pressedButton: DialogButton
		if (this.buttons.cancel) {
			content += `cancelButton: ${this.buttons.cancel}\n`
			pressedButton = confirm(content) ? 'ok' : 'cancel'
		} else if (this.buttons.no) {
			content += `noButton: ${this.buttons.no},\n`
			content += `yesButton: ${this.buttons.yes},\n`
			pressedButton = confirm(content) ? 'yes' : 'no'
		} else if (this.buttons.yes) {
			content += `yesButton: ${this.buttons.yes},\n`
			alert(content)
			pressedButton = 'yes'
		} else {
			alert(content)
			pressedButton = 'ok'
		}
		return {pressedButton}
	}
}

export class EventActionExecutor {
	UUID: string
	subject: string | null = null
	subjects: string[] = []
	constructor(UUID: string) { this.UUID = UUID; }
	setSubject(subjectUUID: string): EventActionExecutor { this.subject = subjectUUID; return this; }
	setSubjects(subjectUUIDs: string[]): EventActionExecutor { this.subjects = subjectUUIDs; return this; }
	execute(): Promise<EventActionResolveResult> { return Promise.resolve({eventActionType: 'sync'}); }
}

export class Frame {
	command: string
	headers: {[key: string]: string}
	body: string
	constructor(command: string, headers: {[key: string]: string} = {}, body = '') {
		this.command = command
		this.headers = headers
		this.body = body
	}
	toString(): string {
		const separator = '\x0A'
		const lines = [this.command]
		for (const name of Object.keys(this.headers)) lines.push(`${name}:${this.headers[name]}`)
		return lines.join(separator) + separator + separator
	}
	sizeOfUTF8(s: string): number { return s ? new TextEncoder().encode(s).length : 0; }
	unmarshall(): void {}
	marshall(): void {}
}

export class UtilsParams {
	a: string[] | null = null
	c: boolean | null = null
	d: number | null = null
	e: number | null = null
	ignoreCase(): UtilsParams { this.c = true; return this; }
	limit(limit: number): UtilsParams { this.d = limit; return this; }
	offset(offset: number): UtilsParams { this.e = offset; return this; }
	attrs(attributes: string[]): UtilsParams { this.a = attributes; return this; }
}
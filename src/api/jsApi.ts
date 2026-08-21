import {DialogBuilder, EventActionExecutor, Frame, UtilsParams, InitVariable} from '../core/classes'
import type {IJsApi, RuntimeJsApi} from '../types/jsApi'
import type {AttributeOrParamMap, FormType, MakeOptions, RestCallOptions} from '../types'

export type {IJsApi} from '../types/jsApi'

const jsApi: RuntimeJsApi = {
	constants: {} as InitVariable,
	commands: {
		editObject(uuid) { window.open(`${window.jsApi.getAppBaseUrl()}operator/#edit:${uuid}`, '_self'); },
		quickAddObject(classFqn, formCode, properties, callbackFn = () => {}) {
			const isConfirm = confirm(`Создание объекта в dev режиме с параметрами: ${classFqn}, ${formCode}, ${JSON.stringify(properties)}`)
			callbackFn(isConfirm ? 'stub$uuid' : null, isConfirm ? null : new Error('Ошибка создания объекта'))
		},
		quickEditObject(uuid, formCode, properties, callbackFn = () => {}) {
			const isConfirm = confirm(`Редактирование объекта в dev режиме с параметрами: ${uuid}, ${formCode}, ${JSON.stringify(properties)}`)
			callbackFn(isConfirm ? uuid : null, isConfirm ? null : new Error('Ошибка редактирования объекта'))
		},
		selectObjectDialog(classFqn, presentAttributesGroupCode) {
			const isConfirm = confirm(`Открытие сложной формы в dev режиме с параметрами: ${classFqn}, ${presentAttributesGroupCode}`)
			return Promise.resolve(isConfirm ? 'stub$uuid' : null)
		}
	},
	configuration: {
		byContentCode: async <T>() => ({} as T),
		byDefault: async <T>() => ({} as T)
	},
	contents: {
		getHeight() {
			const frame = window.frameElement as HTMLIFrameElement | null
			const currentDocument = frame ? frame.contentDocument : document
			return currentDocument?.body.getBoundingClientRect().height || 0
		},
		getIframeLayoutInfo() {
			const frame = window.frameElement as HTMLIFrameElement | null
			const currentDocument = frame ? frame.contentDocument : document
			return Promise.resolve(currentDocument?.body.getBoundingClientRect() as DOMRect)
		},
		getInitialHeight() {
			const initialHeight = (window.frameElement as HTMLIFrameElement | null)?.dataset.initialHeight
			return initialHeight ? parseInt(initialHeight, 10) : 400
		},
		getParameters: async () => ({}),
		setHeight(height) {
			const frame = window.frameElement as HTMLIFrameElement | null
			const currentDocument = frame ? frame.contentDocument : document
			if (currentDocument) currentDocument.body.style.height = `${height}px`
			return Promise.resolve({})
		}
	},
	eventActions: {getEventActionExecutor: eventUuid => new EventActionExecutor(eventUuid)},
	events: {
		addFieldChangeListener() {}, addSubjectChangeListener() {}, onContentHide() {},
		onContentShow() {}, onFullscreenDisabled() {}, onFullscreenEnabled() {}, onUpdatePermissions() {}
	},
	extractSubjectUuid() { return this.constants.SUBJECT_UUID || null; },
	findApplicationCode() { return this.constants.APP_CODE || ''; },
	findContentCode() { return this.constants.APP_CODE || ''; },
	forms: {
		cancel() {},
		changeResponsible(uuid) {
			alert(`Вызвано событие изменения ответственного с uuid: ${uuid}\nДействие не будет выполнено в dev режиме`)
			return Promise.resolve(null)
		},
		changeState(uuid, states, requiredConfirm = true) {
			if (states.length) {
				const newState = states[0]
				const text = `Вызвано событие изменения статуса объекта с uuid: ${uuid}\nВ тестовом режиме вернется статус: ${newState}\nДействие не будет выполнено в dev режиме`
				const isConfirm = requiredConfirm ? confirm(text) : (alert(text), true)
				if (isConfirm) return Promise.resolve({state: newState})
			}
			return Promise.resolve(null)
		},
		getType: (): FormType => 'objectCard',
		getValues: async <T>() => ({} as T),
		isModal: () => false
	},
	getAppBaseUrl() {
		const baseUrl = this.constants.APP_URL
		if (baseUrl && /^(https?:\/\/[a-zA-Z0-9:.-]+\/?)$/.test(baseUrl)) return `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}sd/`
		alert('Ссылка на приложение не передана или имеет неверный формат')
		return ''
	},
	getAppRestBaseUrl() { const baseUrl = this.getAppBaseUrl(); return baseUrl ? `${baseUrl}services/${this.constants.REST_PATH}` : ''; },
	getBrowserType: () => 'browser',
	getCurrentLocale: () => 'ru',
	getCurrentUser() {
		return {
			uuid: this.constants.USER_UUID || '', admin: this.constants.USER_ADMIN || false,
			licensed: this.constants.USER_LICENSED || false, concurrentLicensed: this.constants.USER_CONCURRENT_LICENSED || false,
			login: this.constants.USER_LOGIN || '', title: this.constants.USER_TITLE || '', operatorLogo: '',
			profiles: this.constants.USER_PROFILES || '', roles: this.constants.USER_ROLES || ''
		}
	},
	getViewMode: () => 'normal',
	getWebViewType: () => null,
	isAddForm: () => false,
	isEditForm: () => false,
	isOnObjectCard: () => true,
	modals: {
		getBodyLayoutInfo: async () => null,
		getDialogBuilder: content => new DialogBuilder(content)
	},
	page: {
		getHeaderLayoutInfo: async () => ({height: 0}),
		getWindowLayoutInfo() {
			const currentWindow = window.frameElement ? window.parent : window
			return Promise.resolve({innerHeight: currentWindow.innerHeight, innerWidth: currentWindow.innerWidth})
		}
	},
	registerAttributeToModification(attributeCode, resultCallback) {
		const result = resultCallback()
		const stringValue = typeof result === 'object' ? JSON.stringify(result) : String(result)
		alert(`Встроенным приложением редактируется атрибут ${attributeCode} со значением ${stringValue}`)
	},
	async makeResponse(url: string, options: RestCallOptions & {url?: string}, isJson = false, isExecMF = false) {
		const {url: makeUrl, method = 'GET', headers, body, responseType} = options
		const requestBody = typeof body === 'object' ? JSON.stringify(body) : body
		let requestUrl = makeUrl || `${this.getAppRestBaseUrl()}${url}${isExecMF ? '?' : '&'}accessKey=${this.constants.ACCESS_KEY}`
		if (makeUrl && !makeUrl.includes('accessKey')) requestUrl += `&accessKey=${this.constants.ACCESS_KEY}`
		const response = await fetch(requestUrl, {
			method, headers: {'Content-Type': 'application/json', embeddedApplicationCode: this.constants.APP_CODE, ...headers},
			body: method !== 'GET' ? requestBody : undefined
		})
		if (!response.ok) {
			const errorText = await response.text()
			throw isJson ? JSON.parse(errorText) : errorText
		}
		if (responseType === 'blob') return response.blob()
		if (responseType === 'arraybuffer') return response.arrayBuffer()
		const responseText = await response.text()
		return isJson || responseType === 'json' ? JSON.parse(responseText) : responseText
	},
	requests: {
		json<T>(options: MakeOptions) { return (window.jsApi as RuntimeJsApi).makeResponse('', options, true) as Promise<T>; },
		make(options: MakeOptions) { return (window.jsApi as RuntimeJsApi).makeResponse('', options) as Promise<string>; }
	},
	restCall(url, options) { return this.makeResponse(url, options) as Promise<string>; },
	restCallAsJson<T>(url: string, options: RestCallOptions = {}) { return this.makeResponse(url, options, true) as Promise<T>; },
	restCallModule<T>(moduleCode: string, functionName: string, ...args: Array<number | string | boolean | {[key: string]: any}>) {
		return this.makeResponse('/execmf', {body: JSON.stringify([{method: functionName, module: moduleCode, params: args}]), method: 'POST'}, true) as Promise<T>
	},
	urls: {
		base() { return `${window.jsApi.getAppBaseUrl()}operator/`; },
		goTo(link) { window.open(link, '_self'); },
		objectAddForm(fqn) { return `${window.jsApi.getAppBaseUrl()}operator/#add:${fqn}`; },
		objectCard(uuid) { return `${window.jsApi.getAppBaseUrl()}operator/#uuid:${uuid}`; },
		objectEditForm(uuid) { return `${window.jsApi.getAppBaseUrl()}operator/#edit:${uuid}`; }
	},
	utils: {
		buildParams: () => new UtilsParams(), create: async () => ({}), delete: async () => '', edit: async () => ({}),
		find: async () => ([{}] as AttributeOrParamMap[]), findFirst: async () => ({}), get: async () => ({})
	},
	ws: {
		connect(callback) { callback(); alert('Вызов метода, который подключается к брокеру сообщений, передаваемых через websocket-канал'); },
		disconnect() { alert('Вызов метода, который отключается от брокера сообщений, передаваемых через websocket-канал'); },
		send(destination, message) { alert(`Вызов метода, который отправляет сообщение "${message}" в websocket-канал с адресом: ${destination}`); },
		subscribe(destination, callback) { callback(new Frame(destination)); alert(`Вызов метода, который подписывается на сообщения, передаваемые через websocket-канал с адресом: ${destination}`); },
		unsubscribe(destination) { alert(`Вызов метода, который отписывается от сообщений, передаваемые через websocket-канал с адресом: ${destination}`); }
	}
}

export default jsApi
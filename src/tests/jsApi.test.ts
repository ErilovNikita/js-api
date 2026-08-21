/// <reference types="jest" />

import initializeJsApi from '../api/initialize'
import {InitVariable} from '../core/classes'

const params = new InitVariable(
	'development',
	'access-key',
	'https://example.com',
	'app-code',
	'rest',
	'subject-uuid',
	'user-login',
	'user-uuid',
	true,
	true,
	false,
	'User title',
	'profile',
	'role'
)

function getResponse(body: unknown = {}) {
	return {
		ok: true,
		text: async () => JSON.stringify(body),
		blob: async () => new Blob(['response']),
		arrayBuffer: async () => new ArrayBuffer(0)
	}
}

describe('jsApi mock', () => {
	let alertSpy: jest.SpiedFunction<typeof window.alert>
	let confirmSpy: jest.SpiedFunction<typeof window.confirm>
	let openSpy: jest.SpiedFunction<typeof window.open>
	let fetchSpy: jest.SpiedFunction<typeof fetch>
	let originalFetch: typeof fetch | undefined

	beforeEach(async () => {
		alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
		confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
		openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
		originalFetch = globalThis.fetch
		fetchSpy = jest.fn().mockResolvedValue(getResponse({result: true}) as Response)
		globalThis.fetch = fetchSpy as unknown as typeof fetch
		await initializeJsApi({}, params)
	})

	afterEach(() => {
		if (originalFetch) globalThis.fetch = originalFetch
		else delete (globalThis as {fetch?: typeof fetch}).fetch
		jest.restoreAllMocks()
	})

	it('выполняет команды работы с объектами', async () => {
		window.jsApi.commands.editObject('object-uuid')
		expect(openSpy).toHaveBeenCalledWith('https://example.com/sd/operator/#edit:object-uuid', '_self')

		const addCallback = jest.fn()
		window.jsApi.commands.quickAddObject('object.Fqn', 'add', {name: 'value'}, addCallback)
		expect(addCallback).toHaveBeenCalledWith('stub$uuid', null)

		const editCallback = jest.fn()
		window.jsApi.commands.quickEditObject('object-uuid', 'edit', {}, editCallback)
		expect(editCallback).toHaveBeenCalledWith('object-uuid', null)
		expect(await window.jsApi.commands.selectObjectDialog('object.Fqn', 'present')).toBe('stub$uuid')

		confirmSpy.mockReturnValue(false)
		const rejectedCallback = jest.fn()
		window.jsApi.commands.quickAddObject('object.Fqn', 'add', {}, rejectedCallback)
		expect(rejectedCallback.mock.calls[0][0]).toBeNull()
		expect(rejectedCallback.mock.calls[0][1]).toBeInstanceOf(Error)
		expect(await window.jsApi.commands.selectObjectDialog('object.Fqn', 'present')).toBeNull()
	})

	it('возвращает результаты configuration и contents', async () => {
		expect(await window.jsApi.configuration.byContentCode('module')).toEqual({})
		expect(await window.jsApi.configuration.byDefault('module')).toEqual({})
		expect(window.jsApi.contents.getHeight()).toBe(0)
		expect(await window.jsApi.contents.getIframeLayoutInfo()).toMatchObject({height: 0})
		expect(window.jsApi.contents.getInitialHeight()).toBe(400)
		expect(await window.jsApi.contents.getParameters()).toEqual({})

	await window.jsApi.contents.setHeight(240)
	expect(document.body.style.height).toBe('240px')
})

	it('создаёт event action executor и вызывает event listeners safely', () => {
		const executor = window.jsApi.eventActions.getEventActionExecutor('event-uuid')
		expect(executor.setSubject('subject-uuid')).toBe(executor)
		expect(executor.setSubjects(['subject-1', 'subject-2'])).toBe(executor)
		expect(executor.execute()).resolves.toEqual({eventActionType: 'sync'})

		const callback = jest.fn()
		expect(() => {
			window.jsApi.events.addFieldChangeListener('field', callback)
			window.jsApi.events.addSubjectChangeListener('field', callback)
			window.jsApi.events.onContentHide(callback)
			window.jsApi.events.onContentShow(callback)
			window.jsApi.events.onFullscreenDisabled(callback)
			window.jsApi.events.onFullscreenEnabled(callback)
			window.jsApi.events.onUpdatePermissions(callback)
		}).not.toThrow()
		expect(callback).not.toHaveBeenCalled()
	})

	it('работает с forms', async () => {
		expect(window.jsApi.forms.cancel()).toBeUndefined()
		expect(await window.jsApi.forms.changeResponsible('subject-uuid')).toBeNull()
		expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('subject-uuid'))
		expect(await window.jsApi.forms.changeState('subject-uuid', [])).toBeNull()
		expect(await window.jsApi.forms.changeState('subject-uuid', ['closed'])).toEqual({state: 'closed'})
		expect(window.jsApi.forms.getType()).toBe('objectCard')
		expect(await window.jsApi.forms.getValues()).toEqual({})
		expect(window.jsApi.forms.isModal()).toBe(false)

	confirmSpy.mockReturnValue(false)
		expect(await window.jsApi.forms.changeState('subject-uuid', ['closed'])).toBeNull()
	})

	it('возвращает основные параметры jsApi', () => {
		expect(window.jsApi.extractSubjectUuid()).toBe('subject-uuid')
		expect(window.jsApi.findApplicationCode()).toBe('app-code')
		expect(window.jsApi.findContentCode()).toBe('app-code')
		expect(window.jsApi.getAppBaseUrl()).toBe('https://example.com/sd/')
		expect(window.jsApi.getAppRestBaseUrl()).toBe('https://example.com/sd/services/rest')
		expect(window.jsApi.getBrowserType()).toBe('browser')
		expect(window.jsApi.getCurrentLocale()).toBe('ru')
		expect(window.jsApi.getCurrentUser()).toEqual({
		uuid: 'user-uuid',
		admin: true,
		licensed: true,
		concurrentLicensed: false,
		login: 'user-login',
		title: 'User title',
		operatorLogo: '',
		profiles: 'profile',
		roles: 'role'
	})
		expect(window.jsApi.getViewMode()).toBe('normal')
		expect(window.jsApi.getWebViewType()).toBeNull()
		expect(window.jsApi.isAddForm()).toBe(false)
		expect(window.jsApi.isEditForm()).toBe(false)
		expect(window.jsApi.isOnObjectCard()).toBe(true)
	})

	it('работает с modals, page и registerAttributeToModification', async () => {
		expect(await window.jsApi.modals.getBodyLayoutInfo()).toBeNull()
		const dialog = window.jsApi.modals.getDialogBuilder('Content')
		dialog.addYesButton().setTitle('Title')
		expect(await dialog.show()).toEqual({pressedButton: 'yes'})
		expect(await window.jsApi.page.getHeaderLayoutInfo()).toEqual({height: 0})
		expect(await window.jsApi.page.getWindowLayoutInfo()).toMatchObject({
		innerHeight: window.innerHeight,
		innerWidth: window.innerWidth
	})

	window.jsApi.registerAttributeToModification('name', () => 'value')
		expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('name'))
	})

	it('выполняет requests и REST-вызовы', async () => {
		expect(await window.jsApi.requests.json({url: '/json'})).toEqual({result: true})
		expect(await window.jsApi.requests.make({url: '/text'})).toBe('{"result":true}')
		expect(await window.jsApi.restCall('/text', {})).toBe('{"result":true}')
		expect(await window.jsApi.restCallAsJson('/json', {})).toEqual({result: true})
		expect(await window.jsApi.restCallModule('module', 'method', 'argument')).toEqual({result: true})
		expect(fetchSpy).toHaveBeenCalled()
		expect(fetchSpy.mock.calls[0][0]).toContain('accessKey=access-key')

	fetchSpy.mockResolvedValueOnce(getResponse('blob') as Response)
	expect(await window.jsApi.restCall('/blob', {responseType: 'blob'})).toBeInstanceOf(Blob)
	fetchSpy.mockResolvedValueOnce(getResponse('arraybuffer') as Response)
	expect(await window.jsApi.restCall('/arraybuffer', {responseType: 'arraybuffer'})).toBeInstanceOf(ArrayBuffer)

	fetchSpy.mockResolvedValueOnce({ok: false, text: async () => 'failure'} as Response)
	await expect(window.jsApi.restCall('/failure', {})).rejects.toBe('failure')
})

	it('строит URL и работает с utils', async () => {
		expect(window.jsApi.urls.base()).toBe('https://example.com/sd/operator/')
		expect(window.jsApi.urls.objectAddForm('object.Fqn')).toBe('https://example.com/sd/operator/#add:object.Fqn')
		expect(window.jsApi.urls.objectCard('object-uuid')).toBe('https://example.com/sd/operator/#uuid:object-uuid')
		expect(window.jsApi.urls.objectEditForm('object-uuid')).toBe('https://example.com/sd/operator/#edit:object-uuid')
	window.jsApi.urls.goTo('https://other.example.com')
	expect(openSpy).toHaveBeenCalledWith('https://other.example.com', '_self')

	const query = window.jsApi.utils.buildParams().ignoreCase().limit(10).offset(2).attrs(['name'])
	expect(query).toMatchObject({a: ['name'], c: true, d: 10, e: 2})
	expect(await window.jsApi.utils.create('object.Fqn', {})).toEqual({})
	expect(await window.jsApi.utils.delete('object-uuid')).toBe('')
	expect(await window.jsApi.utils.edit('object-uuid', {})).toEqual({})
	expect(await window.jsApi.utils.find('object.Fqn', {})).toEqual([{}])
	expect(await window.jsApi.utils.findFirst('object.Fqn', {})).toEqual({})
	expect(await window.jsApi.utils.get('object-uuid')).toEqual({})
})

	it('выполняет websocket mock methods', () => {
		const callback = jest.fn()
		window.jsApi.ws.connect(callback)
		window.jsApi.ws.disconnect()
		window.jsApi.ws.send('/topic', 'message')
		window.jsApi.ws.subscribe('/topic', callback)
		window.jsApi.ws.unsubscribe('/topic')

		expect(callback).toHaveBeenCalledTimes(2)
		expect(callback.mock.calls[1][0]).toMatchObject({command: '/topic'})
		expect(alertSpy).toHaveBeenCalledTimes(5)
	})
})
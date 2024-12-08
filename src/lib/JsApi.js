import {DialogBuilder, EventActionExecutor, Frame, UtilsParams} from './classes';

/**
 * @type {IJsApi}
 */
const jsApi = {
	constants: null,
	commands: {
		editObject (uuid) {
			const url = `${this.getAppBaseUrl()}operator/#edit:${uuid}`;

			window.open(url, '_self');
		},
		quickAddObject (classFqn, formCode, properties, callbackFn) {
			const isConfirm = confirm(`Создание объекта в dev режиме с параметрами: ${classFqn}, ${formCode}, ${JSON.stringify(properties)}`);

			if (isConfirm) {
				callbackFn('stub$uuid', null);
			} else {
				callbackFn(null, new Error('Ошибка создания объекта'));
			}
		},
		quickEditObject (uuid, formCode, properties, callbackFn) {
			const isConfirm = confirm(`Редактирование объекта в dev режиме с параметрами: ${uuid}, ${formCode}, ${JSON.stringify(properties)}`);

			if (isConfirm) {
				callbackFn(uuid, null);
			} else {
				callbackFn(null, new Error('Ошибка редактирования объекта'));
			}
		},
		selectObjectDialog (classFqn, presentAttributesGroupCode) {
			const isConfirm = confirm(`Открытие сложной формы в dev режиме с параметрами: ${classFqn}, ${presentAttributesGroupCode}`);

			return Promise.resolve(isConfirm ? 'stub$uuid' : null);
		}
	},
	configuration: {
		byContentCode () {
			return Promise.resolve({});
		},
		byDefault () {
			return Promise.resolve({});
		}
	},
	contents: {
		getHeight () {
			const frame = window.frameElement;
			const currentDocument = frame ? frame.contentDocument : document;

			return currentDocument.body.getBoundingClientRect().height;
		},
		getIframeLayoutInfo () {
			const frame = window.frameElement;
			const currentDocument = frame ? frame.contentDocument : document;

			return Promise.resolve(currentDocument.body.getBoundingClientRect());
		},
		getInitialHeight () {
			const frame = window.frameElement;

			if (frame && frame.dataset.initialHeight) {
				return parseInt(frame.dataset.initialHeight);
			}

			return 400;
		},
		getParameters () {
			return Promise.resolve({});
		},
		setHeight (height) {
			const frame = window.frameElement;
			const currentDocument = frame ? frame.contentDocument : document;

			currentDocument.body.style.height = `${height}px`;

			return Promise.resolve({});
		}
	},
	eventActions: {
		getEventActionExecutor (eventUuid) {
			return new EventActionExecutor(eventUuid);
		}
	},
	events: {
		addFieldChangeListener () {},
		addSubjectChangeListener () {},
		onContentHide () {},
		onContentShow () {},
		onFullscreenDisabled () {},
		onFullscreenEnabled () {},
		onUpdatePermissions () {}
	},
	extractSubjectUuid () {
		return this.constants.SUBJECT_UUID || null;
	},
	findApplicationCode () {
		return this.constants.APP_CODE || '';
	},
	findContentCode () {
		return this.constants.APP_CODE || '';
	},
	forms: {
		cancel () {},
		changeResponsible (uuid) {
			alert(`Вызвано событие изменения ответственного с uuid: ${uuid}\n`
				+ 'Действие не будет выполнено в dev режиме');
			return Promise.resolve(null);
		},
		changeState (uuid, states, requiredConfirm) {
			if (states.length) {
				let isConfirm = true;
				const newState = states[0];
				const alertText = `Вызвано событие изменения статуса объекта с uuid: ${uuid}\n`
					+ `В тестовом режиме вернется статус: ${newState}\n`
					+ 'Действие не будет выполнено в dev режиме';

				if (requiredConfirm) {
					isConfirm = confirm(alertText);
				} else {
					alert(alertText);
				}

				if (isConfirm) {
					return Promise.resolve({state: newState});
				}
			}

			return Promise.resolve(null);
		},
		getType () {
			return objectCard;
		},
		getValues () {
			return Promise.resolve({});
		},
		isModal () {
			return false;
		}
	},
	async makeResponse (url, options, isJson = false, isExecMF = false) {
		const { url: makeUrl, method = 'GET', headers, body, responseType } = options;
		const requestBody = typeof body === 'object' ? JSON.stringify(body) : body;
		let requestUrl = makeUrl || `${this.getAppRestBaseUrl()}${url}${isExecMF ? '?' : '&'}accessKey=${this.constants.ACCESS_KEY}`;

		if ( makeUrl && makeUrl.indexOf('accessKey') == -1 ) {
			requestUrl += `&accessKey=${this.constants.ACCESS_KEY}`
		}

		try {
			const response = await fetch(requestUrl, {
				method,
				headers: {
					'Content-Type': 'application/json',
					'embeddedApplicationCode': this.constants.APP_CODE,
					...headers
				},
				body: method !== 'GET' ? requestBody : undefined
			});
		
			if (!response.ok) {
				const errorText = await response.text();
				throw isJson ? JSON.parse(errorText) : errorText;
			}
			const responseText = await response.text();
			const shouldParseToJson = isJson || responseType === 'json';

			// if (isExecMF) { return JSON.parse(JSON.parse(responseText));}

			return shouldParseToJson ? JSON.parse(responseText) : responseText;
		} catch (error) {
			throw error;
		}
	},
	getAppBaseUrl () {
		const baseUrl = this.constants.APP_URL
		let result = '';

		// Минимальная проверка на то, что ссылка имеет вид: http(s)://domain(:port)(/)
		const regexUrl = /^(https?:\/\/[a-zA-Z0-9:.-]+\/?)$/;

		if (baseUrl && regexUrl.test(baseUrl)) {
			result = baseUrl.endsWith('/') ? `${baseUrl}sd/` : `${baseUrl}/sd/`;
		} else {
			alert('Ссылка на приложение не передана или имеет неверный формат');
		}

		return result;
	},
	getAppRestBaseUrl () {
		const baseUrl = this.getAppBaseUrl();
		let result = '';

		if (baseUrl) {
			result = `${baseUrl}services/${this.constants.REST_PATH}`;
		}

		return result;
	},
	getBrowserType () {
		return 'browser';
	},
	getCurrentLocale () {
		return 'ru';
	},
	getCurrentUser () {
		return {
			uuid: this.constants.USER_UUID || ''
		};
	},
	getViewMode () {
		return 'normal';
	},
	getWebViewType () {
		return null;
	},
	isAddForm () {
		return false;
	},
	isEditForm () {
		return false;
	},
	isOnObjectCard () {
		return true;
	},
	modals: {
		getBodyLayoutInfo () {
			return Promise.resolve(null);
		},
		getDialogBuilder (content) {
			return new DialogBuilder(content);
		}
	},
	page: {
		getHeaderLayoutInfo () {
			return Promise.resolve({height: 0});
		},
		getWindowLayoutInfo () {
			const frame = window.frameElement;
			const currentWindow = frame ? window.parent : window;

			return Promise.resolve({
				innerHeight: currentWindow.innerHeight,
				innerWidth: currentWindow.innerWidth
			});
		}
	},
	registerAttributeToModification (attributeCode, resultCallback) {
		const result = resultCallback();
		let stringValue = result.toString();

		if (typeof result === 'object') {
			stringValue = JSON.stringify(result);
		}

		alert(`Встроенным приложением редактируется атрибут ${attributeCode} со значением ${stringValue}`);
	},
	requests: {
		async json (options) {
			return await this.makeResponse('', options, true);
		},
		async make (options) {
			return await this.makeResponse('', options);
		}
	},
	async restCall (url, options) {
		return await this.makeResponse(url, options);
	},
	async restCallAsJson (url, options) {
		return await this.makeResponse(url, options, true, true);
	},
	async restCallModule (moduleCode, functionName, ...args) {
		let requestBody = [{
			method: functionName,
			module: moduleCode,
			params: [...args]
		}];

		const options = {
			body: JSON.stringify(requestBody),
			method: 'POST'
		};

		return await this.makeResponse('/execmf', options, true);
	},
	urls: {
		base () {
			return `${this.getAppBaseUrl()}operator/`;
		},
		goTo (link) {
			window.open(link, '_self');
		},
		objectAddForm (fqn) {
			const baseUrl = this.getAppBaseUrl();
			return `${baseUrl}operator/#add:${fqn}`;
		},
		objectCard (uuid) {
			const baseUrl = this.getAppBaseUrl();
			return `${baseUrl}operator/#uuid:${uuid}`;
		},
		objectEditForm (uuid) {
			const baseUrl = this.getAppBaseUrl();
			return `${baseUrl}operator/#edit:${uuid}`;
		}
	},
	utils: {
		buildParams () {
			return new UtilsParams();
		},
		create () {
			return Promise.resolve({});
		},
		delete () {
			return Promise.resolve('');
		},
		edit () {
			return Promise.resolve({});
		},
		find () {
			return Promise.resolve([{}]);
		},
		findFirst () {
			return Promise.resolve({});
		},
		get () {
			return Promise.resolve({});
		}
	},
	ws: {
		connect (callback) {
			callback();
			alert('Вызов метода, который подключается к брокеру сообщений, передаваемых через websocket-канал');
		},
		disconnect () {
			alert('Вызов метода, который отключается от брокера сообщений, передаваемых через websocket-канал');
		},
		send (destination, message) {
			alert(`Вызов метода, который отправляет сообщение "${message}" в websocket-канал с адресом: ${destination}`);
		},
		subscribe (destination, callback) {
			const message = new Frame(destination);

			callback(message);
			alert(`Вызов метода, который подписывается на сообщения, передаваемые через websocket-канал с адресом: ${destination}`);
		},
		unsubscribe (destination) {
			alert(`Вызов метода, который отписывается от сообщений, передаваемые через websocket-канал с адресом: ${destination}`);
		}
	}
};

export default jsApi;

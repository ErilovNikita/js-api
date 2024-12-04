export class InitVariable {
	MODE = "production";
	ACCESS_KEY;
	APP_URL;
	APP_CODE;
	REST_PATH;
	SUBJECT_UUID;
	USER_LOGIN;
	USER_UUID;

	/**
	 * @param {string} MODE
	 * @param {string} ACCESS_KEY
	 * @param {string} APP_URL
	 * @param {string} APP_CODE
	 * @param {string} REST_PATH
	 * @param {string} SUBJECT_UUID
	 * @param {string} USER_LOGIN
	 * @param {string} USER_UUID
	 */
	constructor (MODE, ACCESS_KEY, APP_URL, APP_CODE, REST_PATH, SUBJECT_UUID, USER_LOGIN, USER_UUID) {
		this.MODE = MODE;
		this.ACCESS_KEY = ACCESS_KEY;
		this.APP_URL = APP_URL;
		this.APP_CODE = APP_CODE;
		this.REST_PATH = REST_PATH;
		this.SUBJECT_UUID = SUBJECT_UUID;
		this.USER_LOGIN = USER_LOGIN;
		this.USER_UUID = USER_UUID;
		return this;
	}
}

export class DialogBuilder {
	title = null;
	content = '';
	buttons = {};

	/**
	 * @param {string} content
	 * @returns {DialogBuilder}
	 */
	constructor (content) {
		this.content = content;
		return this;
	}

	/**
	 * @param {string?} title
	 * @returns {DialogBuilder}
	 */
	addYesButton (title) {
		this.buttons.yes = title || 'Да';
		return this;
	}

	/**
	 * @param {string?} title
	 * @returns {DialogBuilder}
	 */
	addNoButton (title) {
		this.buttons.no = title || 'Нет';
		return this;
	}

	/**
	 * @param {string?} title
	 * @returns {DialogBuilder}
	 */
	addCancelButton (title) {
		this.buttons.cancel = title || 'Отмена';
		return this;
	}

	/**
	 * @param {string} title
	 * @returns {DialogBuilder}
	 */
	setTitle (title) {
		this.title = title;
		return this;
	}

	/**
	 * @returns {Promise<DialogResolveResult | Error>}
	 */
	async show () {
		let content = `title: ${this.title},\ncontent: ${this.content},\n`;
		/**
		 * @type {DialogButton}
		 */
		let pressedButton;

		if (this.buttons.cancel) {
			content += `cancelButton: ${this.buttons.cancel}\n`;

			const isConfirm = confirm(content);

			pressedButton = isConfirm ? 'ok' : 'cancel';
		} else if (this.buttons.no) {
			content += `noButton: ${this.buttons.no},\n`;
			content += `yesButton: ${this.buttons.yes},\n`;

			const isConfirm = confirm(content);

			pressedButton = isConfirm ? 'yes' : 'no';
		} else if (this.buttons.yes) {
			content += `yesButton: ${this.buttons.yes},\n`;

			alert(content);

			pressedButton = 'yes';
		} else {
			alert(content);
			pressedButton = 'ok';
		}

		return {pressedButton};
	}
}

export class EventActionExecutor {
	UUID = null;
	subject = null;
	subjects = [];

	/**
	 * @param {string} UUID
	 * @returns {EventActionExecutor}
	 */
	constructor (UUID) {
		this.UUID = UUID;
		return this;
	}

	/**
	 * @param {string} subjectUUID
	 * @returns {EventActionExecutor}
	 */
	setSubject (subjectUUID) {
		this.subject = subjectUUID;
		return this;
	}

	/**
	 * @param {string[]} subjectUUIDs
	 * @returns {EventActionExecutor}
	 */
	setSubjects (subjectUUIDs) {
		this.subjects = subjectUUIDs;
		return this;
	}

	/**
	 * @returns {Promise<EventActionResolveResult | Error>}
	 */
	execute () {
		return Promise.resolve({eventActionType: 'sync'});
	}
}

export class Frame {
	command;
	headers;
	body;

	/**
	 * @param {string} command
	 * @param {{[key: string]: string}} headers
	 * @param {string} body
	 */
	constructor (command, headers, body) {
		this.command = command;
		this.headers = headers;
		this.body = body;
	}

	/**
	 * @returns {string}
	 */
	toString () {
		const separator = '\x0A';
		const lines = [this.command];

		for (const [name] of Object.keys(this.headers || {})) {
			const value = this.headers[name];

			lines.push(`${name}:${value}`);
		}

		// Реализация из библиотеки Stomp js
		return lines.join(separator) + separator + separator;
	}

	/**
	 * @param {string} s
	 * @returns {number}
	 */
	sizeOfUTF8 (s) {
		return s ? new TextEncoder().encode(s).length : 0;
	}

	unmarshall () {}

	marshall () {}
}

export class UtilsParams {
	a = null;
	c = null;
	d = null;
	e = null;

	/**
	 * @returns {UtilsParams}
	 */
	constructor () {
		return this;
	}

	/**
	 * @returns {UtilsParams}
	 */
	ignoreCase () {
		this.c = true;
		return this;
	}

	/**
	 * @param {number} limit
	 * @returns {UtilsParams}
	 */
	limit (limit) {
		this.d = limit;
		return this;
	}

	/**
	 * @param {number} offset
	 * @returns {UtilsParams}
	 */
	offset (offset) {
		this.e = offset;
		return this;
	}

	/**
	 * @param {string[]} attributes
	 * @returns {UtilsParams}
	 */
	attrs (attributes) {
		this.a = attributes;
		return this;
	}
}

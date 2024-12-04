import {DialogResolveResult, EventActionResolveResult} from '../types/classesProps';

export class InitVariable {
	MODE : string;
	ACCESS_KEY : string;
	APP_URL : string;
	APP_CODE : string;
	REST_PATH : string;
	SUBJECT_UUID ?: string;
	USER_LOGIN ?: string;
	USER_UUID ?: string;

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
	constructor (
		MODE : string,
		ACCESS_KEY : string,
		APP_URL : string,
		APP_CODE : string,
		REST_PATH : string,
		SUBJECT_UUID ?: string,
		USER_LOGIN ?: string,
		USER_UUID ?: string
	) : InitVariable
}

export class DialogBuilder {
	constructor (content: string);

	/**
	 * Добавляет кнопку "Да" на диалоговое окно.
	 * @param {string?} title - Название кнопки "Да", если необходимо название отличное от названия по умолчанию.
	 * @returns {DialogBuilder}
	 */
	addYesButton (title?: string): DialogBuilder;

	/**
	 * Добавляет кнопку "Нет" на диалоговое окно.
	 * @param {string?} title - Название кнопки "Нет", если необходимо название отличное от названия по умолчанию.
	 * @returns {DialogBuilder}
	 */
	addNoButton (title?: string): DialogBuilder;

	/**
	 * Добавляет кнопку "Отмена" на диалоговое окно.
	 * @param {string?} title - Название кнопки "Отмена", если необходимо название отличное от названия по умолчанию.
	 * @returns {DialogBuilder}
	 */
	addCancelButton (title?: string): DialogBuilder;

	/**
	 * Устанавливает название диалогового окна
	 * @param {string} title - Название
	 * @returns {DialogBuilder}
	 */
	setTitle (title: String): DialogBuilder;

	/**
	 * Отображает диалоговое окно и возвращает результат нажатия кнопки
	 * @returns {Promise<DialogResolveResult | Error>} Результат работы метода
	 */
	show (): Promise<DialogResolveResult | Error>;
}

export class EventActionExecutor {
	constructor (eventUuid: string);

	/**
	 * Позволяет задать текущий объект (контекстная переменная subject) для выполнения ПДПС
	 * @param {string} subjectUUID - Идентификатор текущего объекта
	 * @returns {EventActionExecutor}
	 */
	setSubject (subjectUUID: string): EventActionExecutor;

	/**
	 * Позволяет задать несколько объектов (контекстная переменная subjects) для выполнения ПДПС
	 * @param {string[]} subjectUUIDs - Идентификатор текущего объекта
	 * @returns {EventActionExecutor}
	 */
	setSubjects (subjectUUIDs: string[]): EventActionExecutor;

	/**
	 * Выполняет ПДПС и возвращает информацию о результате его выполнения
	 * @returns {Promise<EventActionResolveResult | Error>}
	 */
	execute (): Promise<EventActionResolveResult | Error>;
}

export class Frame {
	command: string;
	headers: {[key: string]: string};
	body: string;

	constructor (command: string, headers?: {[key: string]: string}, body?: string);

	toString (): string;

	static sizeOfUTF8 (s: string): number;

	static unmarshall (data: any): any;

	static marshall (command: string, headers?: {[key: string]: string}, body?: string): any;
}

export class UtilsParams {
	constructor ();

	/**
	 * Устанавливает игнорирование регистра в положение true
	 * @returns {UtilsParams}
	 */
	ignoreCase (): UtilsParams;

	/**
	 * Устанавливает максимальное значение элементов в выдаче
	 * @param {number} limit - Максимальное количество элементов в выдаче
	 * @returns {UtilsParams}
	 */
	limit (limit: number): UtilsParams;

	/**
	 * Устанавливает число элементов, которые необходимо пропустить в выдаче
	 * @param {number} offset - Число элементов, которые необходимо пропустить в выдаче
	 * @returns {UtilsParams}
	 */
	offset (offset: number): UtilsParams;

	/**
	 * Устанавливает список атрибутов, которые необходимо вернуть
	 * @param {string[]} attributes - Список атрибутов, которые необходимо вернуть
	 * @returns {UtilsParams}
	 */
	attrs (attributes: string[]): UtilsParams;
}

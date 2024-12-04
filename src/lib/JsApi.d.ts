import {
	AttributeOrParamMap,
	Callback,
	CommonArgs,
	CommonTransferFormatTypes,
	FormType,
	IframeLayoutInfo,
	JsonOptions,
	JsonPromiseReject,
	MakeOptions,
	MakePromiseReject,
	RestCallOptions
} from '../types';

import {
	DialogBuilder,
	EventActionExecutor,
	Frame,
	UtilsParams,
	InitVariable
} from './classes';

export interface ICommands {
	/**
	 * Команда для перехода на форму редактирования объекта.
	 * @param {string} uuid - UUID объекта, на чью форму редактирования будет совершен переход
	 * @returns {void}
	 */
	editObject (uuid: string): void,
	/**
	 * Команда для вызова модальной формы быстрого добавления объекта.
	 * @param {string} classFqn - FQN класса или типа, в котором настроена форма быстрого добавления
	 * @param {string} formCode - Код формы быстрого добавления
	 * @param {{[key: string]: any}} properties - Значения атрибутов, которые необходимо предварительно заполнить на форме
	 * @param {(uuid: string, exception: Error | null) => void} callback - Функция, которая будет вызвана по результату работы формы
	 * @returns {void}
	 */
	quickAddObject (
		classFqn: string,
		formCode: string,
		properties: {[key: string]: any},
		callback?: (uuid: string | null, exception: Error | null) => void
	): void,
	/**
	 * Команда для вызова модальной формы быстрого редактирования объекта.
	 * @param {string} uuid - UUID редактируемого объекта
	 * @param {string} formCode - Код формы быстрого редактирования
	 * @param {{[key: string]: any}} properties - Значения атрибутов, которые необходимо предварительно заполнить на форме
	 * @param {(uuid: string, exception: Error | null) => void} callback - Функция, которая будет вызвана по результату работы формы
	 * @returns {void}
	 */
	quickEditObject (
		uuid: string,
		formCode: string,
		properties: {[key: string]: any},
		callback?: (uuid: string | null, exception: Error | null) => void
	): void,
	/**
	 * Команда для открытия сложной формы добавления связи и выбора объекта.
	 * @param {string} classFqn - FQN класса объектов, которые будут доступны на форме
	 * @param {string} presentAttributesGroupCode - Код группы атрибутов, которая будет отображаться на форме
	 * @returns {Promise<string | null>} Возвращает UUID если выбран
	 */
	selectObjectDialog (
		classFqn: string,
		presentAttributesGroupCode: string
	): Promise<string | null>
}

export interface IConfiguration {
	/**
	 * Метод служит для конфигурирования встроенного приложения через скриптовый модуль в SMP.
	 * Вызывает функцию в скриптовом модуле, имя которой равняется коду контента,
	 * в котором выведено встроенное приложение.
	 * @param {string} moduleCode - Код модуля, функция которого будут вызываться
	 * @param {CommonArgs[]} args - Аргументы, которые необходимо передать в функцию
	 * @template T - Возвращаемые данные
	 * @returns {Promise<T | JsonPromiseReject>}
	 */
	byContentCode <T>(
		moduleCode: string,
		...args: CommonArgs[]
	): Promise<T | JsonPromiseReject>,
	/**
	 * Метод служит для конфигурирования встроенного приложения через скриптовый модуль в SMP.
	 * Вызывает функцию в скриптовом модуле, имя которой равняется getConfiguration.
	 * @param {string} moduleCode - Код модуля, функция которого будут вызываться
	 * @param {CommonArgs[]} args - Аргументы, которые необходимо передать в функцию
	 * @template T - Возвращаемые данные
	 * @returns {Promise<T | JsonPromiseReject>}
	 */
	byDefault <T>(
		moduleCode: string,
		...args: CommonArgs[]
	): Promise<T | JsonPromiseReject>
}

export interface IContents {
	/**
	 * Возвращает текущую высоту встроенного приложения в px.
	 * Метод доступен с версии 4.16.0
	 * @returns {number}
	 */
	getHeight (): number,
	/**
	 * Возвращает текущие размеры элемента iframe.
	 * Метод доступен с версии 4.17.5
	 * @returns {Promise<IframeLayoutInfo>}
	 */
	getIframeLayoutInfo (): Promise<IframeLayoutInfo>,
	/**
	 * Возвращает исходную высоту встроенного приложения в px.
	 * Метод доступен с версии 4.16.0
	 * @returns {number}
	 */
	getInitialHeight (): number,
	/**
	 * Возвращает параметры, сохраненные в метаинформации контента,
	 * в котором находится встроенное приложение.
	 * Метод доступен с версий 4.11.0.23, 4.11.5.4, 4.12.0
	 * @returns {Promise<AttributeOrParamMap>}
	 */
	getParameters (): Promise<AttributeOrParamMap>,
	/**
	 * Задает высоту встроенного приложения в px.
	 * Метод доступен с версий 4.15.5.11.6, 4.16.0
	 * @param {number} height - Требуемая высота ВП в px
	 * @returns {Promise<{}>}
	 */
	setHeight (height: number): Promise<{}>
}

export interface IEventActions {
	/**
	 * Возвращает класс, который позволяет вызвать пользовательское действие по событию.
	 * Метод доступен с версии 4.16.5
	 * @param {string} eventUuid - Идентификатор пользовательского действия по событию для выполнения
	 * @returns {EventActionExecutor}
	 */
	getEventActionExecutor (eventUuid: string): EventActionExecutor
}

export interface IEvents {
	/**
	 * Подписывается на изменения значения атрибута на форме добавления\редактирования объекта
	 * или параметра формы пользовательского действия по событию.
	 * Метод доступен с версий 4.11.0.23, 4.11.5.4, 4.12.0
	 * @param {string} attrCode - Код атрибута/параметра, на изменения которого выполняется подписка
	 * @param {(result: {attribute: string, newValue: T | CommonTransferFormatTypes}) => void} callback - Функция, которая будет вызвана при изменении атрибута/параметра
	 * @template T - Новое значение атрибута/параметра
	 * @returns {void}
	 */
	addFieldChangeListener (
		attrCode: string,
		callback: <T>(result: {attribute: string, newValue: T | CommonTransferFormatTypes}) => void
	): void,
	/**
	 * Подписывается на изменения текущего объекта на карточке через формы быстрого добавления\редактирования объекта.
	 * Метод доступен с версий 4.11.0.23, 4.11.5.4, 4.12.0
	 * @param {string} attrCode - Код атрибута, значение которого необходимо получать при изменении объекта
	 * @param {(result: AttributeOrParamMap) => void} callback - Функция, которая будет вызвана при изменении атрибута
	 * @returns {void}
	 */
	addSubjectChangeListener (
		attrCode: string,
		callback: (result: AttributeOrParamMap) => void
	): void,
	/**
	 * Подписаться на событие скрытия контента по условиям отображения на формах добавления и редактирования.
	 * Метод доступен с версий 4.12.5.3.10, 4.13.5.2, 4.14.0
	 * @param {Callback} callback - Функция, которая будет вызвана при скрытии контента по условиям отображения
	 * @returns {void}
	 */
	onContentHide (callback: Callback): void,
	/**
	 * Подписаться на событие показа контента по условиям отображения на формах добавления и редактирования.
	 * Метод доступен с версий 4.12.5.3.10, 4.13.5.2, 4.14.0
	 * @param {Callback} callback - Функция, которая будет вызвана при показе контента по условиям отображения
	 * @returns {void}
	 */
	onContentShow (callback: Callback): void,
	/**
	 * Подписаться на событие выхода из полноэкранного режима приложения.
	 * Метод доступен с версий 4.10.0.18.1, 4.11.0
	 * @param {Callback} callback - Функция, которая будет вызвана при выходе из полноэкранного режима
	 * @returns {void}
	 */
	onFullscreenDisabled (callback: Callback): void,
	/**
	 * Подписаться на событие разворачивания приложения на весь экран.
	 * Метод доступен с версий 4.10.0.18.1, 4.11.0
	 * @param {Callback} callback - Функция, которая будет вызвана при разворачивании приложения на весь экран
	 * @returns {void}
	 */
	onFullscreenEnabled (callback: Callback): void,
	/**
	 * Подписаться на событие обновления прав на элементы карточки объекта.
	 * Метод доступен с версий 4.13.0.20, 4.13.5.2.11, 4.13.5.3, 4.14.0.3, 4.14.5
	 * @param {Callback} callback - Функция, которая будет вызвана при обновлении прав
	 * @returns {void}
	 */
	onUpdatePermissions (callback: Callback): void
}

export interface IForms {
	/**
	 * Команда отмены всех форм открытых ранее из jsApi.
	 * Метод доступен с версий 4.11.0.9.16, 4.12.0.36, 4.12.5.10, 4.13.0.14, 4.13.5
	 * @returns {void}
	 */
	cancel (): void,
	/**
	 * Команда вызова формы смены ответственного.
	 * Метод доступен с версий 4.12.0.7, 4.12.5
	 * @param {string} uuid - Идентификатор объекта, для которого необходимо вызвать форму
	 * @returns {Promise<null | undefined | AttributeOrParamMap>}
	 */
	changeResponsible (
		uuid: string
	): Promise<null | undefined | AttributeOrParamMap>,
	/**
	 * Команда для вызова формы смены статуса объекта.
	 * Метод доступен с версий 4.12.0.7, 4.12.5
	 * @param {string} uuid - Идентификатор объекта, чей статус нужно поменять
	 * @param {string[]} states - Коды целевых статусов
	 * @param {boolean?} requiredConfirm - Нужно ли подтверждение перехода, по умолчанию - true
	 */
	changeState (
		uuid: string,
		states: string[],
		requiredConfirm?: boolean
	): Promise<null | undefined | AttributeOrParamMap>,
	/**
	 * Возвращает тип формы, на которой находится встроенное приложение.
	 * Метод доступен с версий 4.14.0.6.1.1, 4.15.5
	 * @returns {FormType}
	 */
	getType (): FormType,
	/**
	 * Возвращает объект из текущего GWT контекста.
	 * Метод доступен с версий 4.11.0.23, 4.11.5.4, 4.12.0
	 * @template T - Объект, чьи ключи являются кодами атрибутов/параметров, а значения - значениями соответствующего атрибута/параметра объекта из текущего контекста
	 * @returns {Promise<T>}
	 */
	getValues <T>(): Promise<T>,
	/**
	 * Проверяет, находится ли встроенное приложение на модальной форме или нет.
	 * Метод доступен с версий 4.14.0.6.1.1, 4.15.5
	 * @returns {boolean}
	 */
	isModal (): boolean
}

export interface IModals {
	/**
	 * Возвращает информацию о текущей модальной форме.
	 * Метод доступен с версии 4.17.5
	 * @returns {Promise<{top: number} | null>}
	 */
	getBodyLayoutInfo (): Promise<{top: number} | null>,
	/**
	 * Возвращает класс для открытия модального диалогового окна. Если на окно не выведено никаких кнопок, то по умолчанию будет выведена кнопка "ОК".
	 * Метод доступен с версии 4.18.0
	 * @param {string} content - Содержание диалогового окна
	 * @returns {DialogBuilder}
	 */
	getDialogBuilder (content: string): DialogBuilder
}

export interface IPage {
	/**
	 * Возвращает информацию о текущих размерах "шапки" страницы.
	 * Метод доступен с версии 4.17.5
	 * @returns {Promise<{height: number}>}
	 */
	getHeaderLayoutInfo (): Promise<{height: number}>,
	/**
	 * Возвращает информацию о размерах страницы браузера.
	 * Метод доступен с версии 4.17.5
	 * @returns {Promise<{innerHeight: number, innerWidth: number}>}
	 */
	getWindowLayoutInfo (): Promise<{innerHeight: number, innerWidth: number}>
}

export interface IRequests {
	/**
	 * Делает запрос на указанный URL
	 * @param {JsonOptions} options - Опции для конфигурации запроса
	 * @template T - Возвращаемые данные
	 * @returns {Promise<T | JsonPromiseReject>} - Ответ сервера, разобранный методом JSON.parse
	 */
	json <T>(options: JsonOptions): Promise<T | JsonPromiseReject>,
	/**
	 * Делает запрос на указанный URL. Является оберткой над XmlHttpRequest
	 * @param {MakeOptions} options - Опции для конфигурации запроса
	 * @returns {Promise<string | MakePromiseReject>} - Ответ сервера в виде строки
	 */
	make (options: MakeOptions): Promise<string | MakePromiseReject>
}

export interface IUrls {
	/**
	 * Возвращает URL интерфейса оператора
	 * @returns {string}
	 */
	base (): string,
	/**
	 * Вызывает переход по переданному URL.
	 * Метод доступен с версий 4.13.0.4, 4.13.5
	 * @param {string} link - Ссылка для перехода
	 * @returns {void}
	 */
	goTo (link: string): void,
	/**
	 * Возвращает URL на форму добавления объекта
	 * @param {string} fqn - FQN класса, на форму добавления которого нужно сгенерировать ссылку
	 * @returns {string}
	 */
	objectAddForm (fqn: string): string,
	/**
	 * Возвращает URL на карточку объекта
	 * @param {string} uuid - UUID объекта, на карточку которого нужно сгенерировать ссылку
	 * @returns {string}
	 */
	objectCard (uuid: string): string,
	/**
	 * Возвращает URL на форму редактирования объекта
	 * @param {string} uuid - UUID объекта, на форму редактирования которого нужно сгенерировать ссылку
	 * @returns {string}
	 */
	objectEditForm (uuid: string): string
}

export interface IUtils {
	/**
	 * Метод позволяет определить опциональные параметры для поиска и получения объектов.
	 * Метод доступен с версии 4.13.0.7.5, 4.13.5
	 * @returns {UtilsParams}
	 */
	buildParams (): UtilsParams,
	/**
	 * Метод для создания объекта с указанными значениями атрибутов.
	 * Метод доступен с версии 4.13.0.7.5, 4.13.5
	 * @param {string} fqn - Код типа создаваемого объекта
	 * @param {AttributeOrParamMap} attributes - Значения атрибутов создаваемого объекта
	 * @param {UtilsParams} params - Позволяет задать список возвращаемых атрибутов, является результатом работы метода jsApi.utils.buildParams(). Если не задан, возвращаются все атрибуты объекта
	 * @returns {Promise<AttributeOrParamMap>}
	 */
	create (fqn: string, attributes: AttributeOrParamMap, params?: UtilsParams): Promise<AttributeOrParamMap>,
	/**
	 * Метод для удаления конкретного объекта по его идентификатору.
	 * Метод доступен с версии 4.13.0.7.5, 4.13.5
	 * @param {string} uuid - Идентификатор объекта, который нужно удалить
	 * @returns {Promise<string>}
	 */
	delete (uuid: string): Promise<string>,
	/**
	 * Метод для редактирования конкретного объекта по его идентификатору.
	 * Метод доступен с версии 4.13.0.7.5, 4.13.5
	 * @param {string} uuid - Идентификатор объекта, который нужно получить
	 * @param {AttributeOrParamMap} attributes - Значения изменяемых атрибутов объекта
	 * @param {UtilsParams} params - Позволяет задать список возвращаемых атрибутов, является результатом работы метода jsApi.utils.buildParams(). Если не задан, возвращаются все атрибуты объекта
	 * @returns {Promise<AttributeOrParamMap>}
	 */
	edit (uuid: string, attributes: AttributeOrParamMap, params?: UtilsParams): Promise<AttributeOrParamMap>,
	/**
	 * Метод для поиска объектов по значениям их атрибутов.
	 * Метод доступен с версии 4.13.0.7.5, 4.13.5
	 * @param {string} uuid - Идентификатор объекта, который нужно получить
	 * @param {AttributeOrParamMap} attributes - Значения атрибутов, с которыми выполняется поиск объектов
	 * @param {UtilsParams?} params - Позволяет задать список возвращаемых атрибутов, является результатом работы метода jsApi.utils.buildParams(). Если не задан, возвращаются все атрибуты объекта
	 * @returns {Promise<AttributeOrParamMap[]>}
	 */
	find (uuid: string, attributes: AttributeOrParamMap, params?: UtilsParams): Promise<AttributeOrParamMap[]>,
	/**
	 * Метод для поиска первого подходящего объекта по значению их атрибутов.
	 * Метод доступен с версии 4.13.0.7.5, 4.13.5
	 * @param {string} uuid - Идентификатор объекта, который нужно получить
	 * @param {AttributeOrParamMap} attributes - Значения атрибутов, с которыми выполняется поиск объектов
	 * @param {UtilsParams?} params - Позволяет задать список возвращаемых атрибутов, является результатом работы метода jsApi.utils.buildParams(). Если не задан, возвращаются все атрибуты объекта
	 * @returns {Promise<AttributeOrParamMap>}
	 */
	findFirst (uuid: string, attributes: AttributeOrParamMap, params?: UtilsParams): Promise<AttributeOrParamMap>,
	/**
	 * Метод для получения конкретного объекта по его идентификатору.
	 * Метод доступен с версии 4.13.0.7.5, 4.13.5
	 * @param {string} uuid - Идентификатор объекта, который нужно получить
	 * @param {UtilsParams} params - Позволяет задать список возвращаемых атрибутов, является результатом работы метода jsApi.utils.buildParams(). Если не задан, возвращаются все атрибуты объекта
	 * @returns {Promise<AttributeOrParamMap>}
	 */
	get (uuid: string, params?: UtilsParams): Promise<AttributeOrParamMap>
}

export interface IWebsockets {
	/**
	 * Подключиться к брокеру сообщений, передаваемых через websocket-канал.
	 * Метод доступен с версии 4.11.5
	 * @param {() => void} callback - Функция, которая будет вызвана после подключения к брокеру сообщений
	 * @returns {void}
	 */
	connect (callback: () => void): void,
	/**
	 * Отключиться от брокера сообщений, передаваемых через websocket-канал.
	 * Метод доступен с версии 4.11.5
	 * @returns {void}
	 */
	disconnect (): void,
	/**
	 * Отправить сообщение в определенный адрес через websocket-канал.
	 * Автоматически подключается к брокеру сообщений перед отправкой, если еще не подключены.
	 * Метод доступен с версии 4.11.5
	 * @param {string} destination - Адрес в websocket-канале, в который отправляем сообщение
	 * @param {string} message - Отправляемое сообщение
	 * @returns {void}
	 */
	send (destination: string, message: string): void,
	/**
	 * Подписаться на сообщения, передаваемые через websocket-канал.
	 * Автоматически подключается к брокеру сообщений перед подпиской, если еще не подключены.
	 * Метод доступен с версии 4.11.5
	 * @param {string} destination - Адрес в websocket-канале, на который подписываемся
	 * @param {(message: Frame) => void} callback - Функция, которая будет вызвана при приходе сообщения через websocket-канал, на адрес destination
	 * @returns {void}
	 */
	subscribe (destination: string, callback: (message: Frame) => void): void,
	/**
	 * Отписаться от получения сообщений, передаваемых через websocket-канал.
	 * Метод доступен с версии 4.11.5
	 * @param {string} destination - Адрес в websocket-канале, от рассылки на который отписываемся
	 * @returns {void}
	 */
	unsubscribe (destination: string): void
}

export interface IJsApi {
	constants: InitVariable,

	commands: ICommands,

	configuration: IConfiguration,

	contents: IContents,

	eventActions: IEventActions,

	events: IEvents,

	/**
	 * Метод возвращает идентификатор объекта, чья карточка открыта в данный момент
	 * @returns {string | null}
	 */
	extractSubjectUuid (): string | null,

	/**
	 * Метод позволяет найти код текущего встроенного приложения
	 * @returns {string}
	 */
	findApplicationCode (): string,

	/**
	 * Метод позволяет найти код контента, в котором выведено текущее приложение
	 * @returns {string}
	 */
	findContentCode (): string,

	forms: IForms,

	/**
	 * Возвращает значение, заданное в свойстве baseurl в dbaccess.properties
	 * @returns {string}
	 */
	getAppBaseUrl (): string,

	/**
	 * Возвращает URL до REST API для использования в ВП
	 * @returns {string}
	 */
	getAppRestBaseUrl (): string,

	/**
	 * Возвращает тип браузера, в котором осуществляется запуск встроенного приложения.
	 * Метод доступен с версии 4.17.0
	 * @returns {'browser' | 'webView'}
	 */
	getBrowserType (): 'browser' | 'webView',

	/**
	 * Возвращает текущую локаль пользователя
	 * @returns {string}
	 */
	getCurrentLocale (): string,

	/**
	 * Возвращает объект, соответствующий текущему пользователю
	 * @returns {{uuid: string}}
	 */
	getCurrentUser (): {
		uuid: string
	},

	/**
	 * Возвращает режим отображения встроенного приложения: развернуто на весь экран или нормальный режим
	 * @returns {'fullScreen' | 'normal'}
	 */
	getViewMode (): 'fullScreen' | 'normal',

	/**
	 * Команда для получения типа WebView, в котором запущено встроенное приложение.
	 * Метод доступен с версии 4.17.0
	 * @returns {'Android' | 'iOS' | null}
	 */
	getWebViewType (): 'Android' | 'iOS' | null,

	/**
	 * Определяет, находится ли приложение на форме добавления
	 * @returns {boolean}
	 */
	isAddForm (): boolean,

	/**
	 * Определяет, находится ли приложение на форме редактирования
	 * @returns {boolean}
	 */
	isEditForm () : boolean,

	/**
	 * Определяет, находится ли приложение на карточке объекта
	 * @returns {boolean}
	 */
	isOnObjectCard (): boolean,

	modals: IModals,

	page: IPage,

	/**
	 * Уведомляет SMP о том, что атрибут/параметр редактируется встроенным приложением
	 * @param {string} attributeCode - Код атрибута/параметра, значение которого редактируется встроенным приложением
	 * @param {<T>() => T} resultCallback - Функция, которая вызывается во время сохранения формы. Результат выполнения функции принимается за значение атрибута/параметра
	 * @template T - Результат выполнения функции обратного вызова
	 * @returns {void}
	 */
	registerAttributeToModification (attributeCode: string, resultCallback: <T>() => T): void,

	requests: IRequests,

	/**
	 * Выполняет REST запрос на сервер SMP
	 * @param {string} url - Весь URL, начиная с имени REST метода
	 * @param {RestCallOptions} options - Опции для конфигурации запроса
	 * @returns {Promise<string>} - Ответ сервера в виде строки
	 */
	restCall (url: string, options: RestCallOptions): Promise<string>,
	/**
	 * Выполняет REST запрос на сервер SMP
	 * @param {string} url - Весь URL, начиная с имени REST метода
	 * @param {RestCallOptions} options - Опции для конфигурации запроса
	 * @template T - Возвращаемые данные
	 * @returns {Promise<T>} - Ответ сервера, разобранный методом JSON.parse
	 */
	restCallAsJson <T>(url: string, options?: RestCallOptions): Promise<T>,
	/**
	 * Вызывает произвольный метод любого скриптового модуля
	 * @param {string} moduleCode - Код скриптового модуля
	 * @param {string} functionName - Имя метода в скриптовом модуле
	 * @param {Array<number | string | boolean | {[key: string]: any}>} args - Аргументы, которые необходимо передать в функцию
	 * @template T - Возвращаемые данные
	 * @returns {Promise<T>} - Ответ сервера, разобранный методом JSON.parse
	 */
	restCallModule <T>(
		moduleCode: string,
		functionName: string,
		...args: Array<number | string | boolean | {[key: string]: any}>
	): Promise<T>,

	urls: IUrls,

	utils: IUtils,

	ws: IWebsockets
}

declare const jsApi: IJsApi;
export default jsApi;

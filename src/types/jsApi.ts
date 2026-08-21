import type {DialogBuilder, EventActionExecutor, Frame, InitVariable, UtilsParams} from '../core/classes'
import type {
	AttributeOrParamMap, Callback, CommonArgs, FormType, IframeLayoutInfo,
	JsonPromiseReject, MakeOptions, RestCallOptions
} from './common'

export interface IJsApi {
	constants: InitVariable
	commands: {
		editObject(uuid: string): void
		quickAddObject(classFqn: string, formCode: string, properties: Record<string, any>, callback?: (uuid: string | null, exception: Error | null) => void): void
		quickEditObject(uuid: string, formCode: string, properties: Record<string, any>, callback?: (uuid: string | null, exception: Error | null) => void): void
		selectObjectDialog(classFqn: string, presentAttributesGroupCode: string): Promise<string | null>
	}
	configuration: {byContentCode<T>(moduleCode: string, ...args: CommonArgs[]): Promise<T | JsonPromiseReject>; byDefault<T>(moduleCode: string, ...args: CommonArgs[]): Promise<T | JsonPromiseReject>}
	contents: {getHeight(): number; getIframeLayoutInfo(): Promise<IframeLayoutInfo>; getInitialHeight(): number; getParameters(): Promise<AttributeOrParamMap>; setHeight(height: number): Promise<{}>}
	eventActions: {getEventActionExecutor(eventUuid: string): EventActionExecutor}
	events: {
		addFieldChangeListener(attrCode: string, callback: <T>(result: {attribute: string; newValue: T}) => void): void
		addSubjectChangeListener(attrCode: string, callback: (result: AttributeOrParamMap) => void): void
		onContentHide(callback: Callback): void; onContentShow(callback: Callback): void
		onFullscreenDisabled(callback: Callback): void; onFullscreenEnabled(callback: Callback): void; onUpdatePermissions(callback: Callback): void
	}
	extractSubjectUuid(): string | null
	findApplicationCode(): string
	findContentCode(): string
	forms: {
		cancel(): void
		changeResponsible(uuid: string): Promise<null | undefined | AttributeOrParamMap>
		changeState(uuid: string, states: string[], requiredConfirm?: boolean): Promise<null | undefined | AttributeOrParamMap>
		getType(): FormType
		getValues<T>(): Promise<T>
		isModal(): boolean
	}
	getAppBaseUrl(): string
	getAppRestBaseUrl(): string
	getBrowserType(): 'browser' | 'webView'
	getCurrentLocale(): string
	getCurrentUser(): {uuid: string; admin: boolean; licensed: boolean; concurrentLicensed: boolean; login: string; title: string; operatorLogo: string; profiles: string | string[]; roles: string | string[]}
	getViewMode(): 'fullScreen' | 'normal'
	getWebViewType(): 'Android' | 'iOS' | null
	isAddForm(): boolean
	isEditForm(): boolean
	isOnObjectCard(): boolean
	modals: {getBodyLayoutInfo(): Promise<{top: number} | null>; getDialogBuilder(content: string): DialogBuilder}
	page: {getHeaderLayoutInfo(): Promise<{height: number}>; getWindowLayoutInfo(): Promise<{innerHeight: number; innerWidth: number}>}
	registerAttributeToModification<T>(attributeCode: string, resultCallback: () => T): void
	requests: {json<T>(options: MakeOptions): Promise<T | JsonPromiseReject>; make(options: MakeOptions): Promise<string | JsonPromiseReject>}
	restCall(url: string, options: RestCallOptions): Promise<string>
	restCallAsJson<T>(url: string, options?: RestCallOptions): Promise<T>
	restCallModule<T>(moduleCode: string, functionName: string, ...args: CommonArgs[]): Promise<T>
	urls: {base(): string; goTo(link: string): void; objectAddForm(fqn: string): string; objectCard(uuid: string): string; objectEditForm(uuid: string): string}
	utils: {
		buildParams(): UtilsParams
		create(fqn: string, attributes: AttributeOrParamMap, params?: UtilsParams): Promise<AttributeOrParamMap>
		delete(uuid: string): Promise<string>
		edit(uuid: string, attributes: AttributeOrParamMap, params?: UtilsParams): Promise<AttributeOrParamMap>
		find(uuid: string, attributes: AttributeOrParamMap, params?: UtilsParams): Promise<AttributeOrParamMap[]>
		findFirst(uuid: string, attributes: AttributeOrParamMap, params?: UtilsParams): Promise<AttributeOrParamMap>
		get(uuid: string, params?: UtilsParams): Promise<AttributeOrParamMap>
	}
	ws: {connect(callback: () => void): void; disconnect(): void; send(destination: string, message: string): void; subscribe(destination: string, callback: (message: Frame) => void): void; unsubscribe(destination: string): void}
}

export type RuntimeJsApi = IJsApi & {
	makeResponse(url: string, options: RestCallOptions, isJson?: boolean, isExecMF?: boolean): Promise<any>
}
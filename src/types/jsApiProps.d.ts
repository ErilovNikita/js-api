export type AttributeOrParamMap = {
	[attrCode: string]: CommonTransferFormatTypes
};

export type Callback = () => void;

export type CommonArgs = number | string | boolean | {[key: string]: any};

export type CommonTransferFormatTypes =
	| null
	| string
	| number
	| TextWithSyntaxHighlighted
	| string[]
	| HyperLink
	| TimeInterval;

export type FormType =
	| 'addCommentForm'
	| 'addFileForm'
	| 'addForm'
	| 'changeAssociationForm'
	| 'changeCaseForm'
	| 'changeResponsibleForm'
	| 'changeStateForm'
	| 'editCommentForm'
	| 'editFileForm'
	| 'editForm'
	| 'objectCard'
	| 'quickAddForm'
	| 'quickEditForm'
	| 'userEventActionForm';

export type HyperLink = {text: string, url: string};

export type IframeLayoutInfo = {
	x: number,
	y: number,
	width: number,
	height: number,
	top: number,
	right: number,
	bottom: number,
	left: number
};

export type JsonOptions = MakeOptions;

export type JsonPromiseReject = MakePromiseReject;

export type MakeOptions = RestCallOptions & {url: string};

export type MakePromiseReject = {
	responseText: string,
	status: number,
	statusText: string
};

export type RestCallOptions = {
	method?: string,
	headers?: {[key: string]: string},
	body?: string | {[key: string]: string},
	responseType?:
	| ''
	| 'arraybuffer'
	| 'blob'
	| 'document'
	| 'json'
	| 'text'
};

export type TextWithSyntaxHighlighted = {
	text: string,
	lang: string
};

export type TimeInterval = {
	interval: 'HOUR' | 'MINUTE' | 'SECOND' | 'DAY' | 'WEEK',
	length: number
};

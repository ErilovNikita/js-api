import {IJsApi} from '../lib/JsApi';

type DeepPartial<T> = T extends object
	? {[P in keyof T]?: DeepPartial<T[P]>}
	: T;

export type PartialJsApi = DeepPartial<IJsApi>;

export {IJsApi};
export * from '../lib/classes';
export * from './jsApiProps';

import {IJsApi} from './lib/JsApi';
import initializeJsApi from './lib/initializeJsApi';
import {InitVariable} from './lib/classes';

declare global {
	interface Window {
		jsApi: IJsApi,
		injectJsApi: (parent: Window, window: Window) => Promise<void>
	}
}

export {initializeJsApi, InitVariable};
export * from './types';

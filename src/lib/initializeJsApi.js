import { deepMergeJsApi } from '../helpers';
import { InitVariable } from './classes';
import jsApi from './JsApi';

/**
 * @template T
 * @param {PartialJsApi & T} mock
 * @param {InitVariable} params
 * @returns {Promise<void>}
 */
async function initializeJsApi (
	mock = {},
	params = null
) {
	if ( !params || params?.MODE == 'production') {
		await window.parent.injectJsApi(window.parent, window);
	} else {
		// Deep merge нужен для того, чтобы не перезаписывать вложенные методы объекта jsApi.
		window.jsApi = deepMergeJsApi(jsApi, mock, params);
	}
	return window.jsApi
}

export default initializeJsApi;
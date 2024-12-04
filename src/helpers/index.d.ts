import { IDevelopmentJsApi } from '../development/developmentJsApi';
import { IJsApi } from '../lib/JsApi';
import { Constants } from 'lib/classes';
import { MakeOptions, MakePromiseReject, PartialJsApi, RestCallOptions } from '../types';

/**
 * Объединяет два объекта, содержащих часть методов jsApi в один объект
 * @param {PartialJsApi} firstJsApi - Первый объект, содержащий часть методов jsApi
 * @param {PartialJsApi} secondJsApi - Второй объект, содержащий часть методов jsApi
 * @param {Constants} constants - Экземпляр класса Constants, содержащий глобальные переменные
 * @template T - Тип возвращаемого объекта jsApi после объединения (JsApi | IJsApi | IDevelopmentJsApi)
 * @returns {T} - Объединенный объект jsApi
 */
export const deepMergeJsApi: <T>(
	firstJsApi: PartialJsApi, 
	secondJsApi: PartialJsApi, 
	constants?: Constants
) => T;

/**
 * Объединяет объект jsApi с объектом, содержащим моковые методы jsApi
 * @param {IJsApi} jsApi - Объект jsApi
 * @param {PartialJsApi} mock - Объект, содержащий моковые методы jsApi
 * @param {Constants} constants - Экземпляр класса Constants, содержащий глобальные переменные
 * @returns {IJsApi} - Объединенный объект jsApi
 */
export const deepMergeActualJsApi: (
	jsApi: IJsApi, 
	mock: PartialJsApi, 
	constants?: Constants
) => IJsApi;

/**
 * Объединяет объект jsApi с объектом, содержащим моковые методы jsApi
 * @param {IDevelopmentJsApi} developmentJsApi - Объект jsApi
 * @param {PartialJsApi} mock - Объект, содержащий моковые методы jsApi
 * @param {Constants} constants - Экземпляр класса Constants, содержащий глобальные переменные
 * @returns {IDevelopmentJsApi} - Объединенный объект jsApi
 */
export const deepMergeDevJsApi: (
	developmentJsApi: IDevelopmentJsApi, 
	mock: PartialJsApi, 
	constants?: Constants
) => IDevelopmentJsApi;
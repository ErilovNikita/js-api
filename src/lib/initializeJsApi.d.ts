import { PartialJsApi } from '../types';
import { InitVariable } from './classes';

/**
 * Выполняет инициализацию jsApi в соответствии с режимом запуска:
 * - При выборе окружения === 'production' - выполняет подключение jsApi с помощью injectJsApi.
 * - В остальных случаях, например, MODE === 'test' || MODE === 'development' - инициализирует переменную jsApi с помощью mock данных.
 * Итоговый mock - результат объединения defaultMockJsApi и mockJsApi.
 * @template T
 * @param {PartialJsApi & T} mock - Моковый jsApi, определенный во встроенном приложении
 * @param {InitVariable} params - Параметры инициализации
 * @returns {Promise<void>}
 */
declare function initializeJsApi <T>(
    mock?: PartialJsApi & T, 
    params?: InitVariable
): Promise<void>;
export default initializeJsApi;

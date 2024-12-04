/**
 * @param {IJsApi} firstJsApi
 * @param {PartialJsApi} secondJsApi
 * @returns {IJsApi}
 */
export const deepMergeJsApi = (
	firstJsApi, 
	secondJsApi,
	constants = {}
) => {
	const result = {...firstJsApi};

	Object.keys(secondJsApi).forEach(key => {
		if (secondJsApi[key] && typeof secondJsApi[key] === 'object') {
			result[key] = deepMergeJsApi(firstJsApi[key], secondJsApi[key]);
		} else {
			result[key] = secondJsApi[key];
		}
	});

	result.constants = constants
	return result;
};
module.exports = {
	moduleFileExtensions: [
		'js',
		'ts'
	],
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	testPathIgnorePatterns: [
		'/node_modules/'
	],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(t|j)s?$',
	transform: {
		'^.+\\.[t|j]s?$': ['ts-jest', {
			isolatedModules: true
		}]
	},
	verbose: true
};

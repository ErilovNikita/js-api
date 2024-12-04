# jsApi

> Форк проекта [@nsmp/js-api](https://www.npmjs.com/package/@nsmp/js-api?activeTab=code) для личных нужны, рекомендовано использование оффициальной ветки

Пакет предназначен для разработчиков встроенных приложений и предоставляет инструменты для улучшения и оптимизации процесса разработки. Пакет предоставляет:
- Функцию `initializeJsApi` для подключения jsApi в разных режимах (development, test, production)
- Файлы декларации типов `.d.ts` для jsApi при работе с `TypeScript`
- `Mock`-функции jsApi для локальной разработки, а также инструменты для их переопределения и уточнения
- Инструменты для локальной разработки с проксированием запросов к приложению

## Изменения
- Удалены лишние зависимости
- Добавлена поддержа других сборщиков
- Исправлены ошибки в юнит тестах
- Переработана логика инициализации
- Исправлены мелкие баги
- Добавлена документация о инициализации библиотеки под Vite

## Содержание <a name="table-of-contents"></a>

- [Быстрый старт](#quick-start)
- [Инициализация jsApi](#initializeJsApi)
- [Переопределение методов jsApi](#mockJsApi)
- [Типизация jsApi](#types)
- [Настройка проксирования запросов](#proxy)

## Быстрый старт <a name="quick-start"></a>

1. Установить пакет: ```npm i --save-dev @nsmp/js-api```
2. Инициализировать jsApi в проекте - [Инициализация jsApi](#initializeJsApi)
3. В режиме разработки (при необходимости):
   1. переопределить стандартные методы jsApi - [Переопределение методов jsApi](#mockJsApi)
   2. настроить проксирование запросов - [Настройка проксирования запросов](#proxy)

[К содержанию](#table-of-contents)

## Инициализация jsApi <a name="initializeJsApi"></a>

Для того чтобы методы jsApi работали во встроенном приложении, необходимо инициализировать их в проекте. Для инициализации jsApi необходимо вызвать функцию `initializeJsApi` из `@nsmp/js-api`. Функция принимает аргументы:
- `mock?: JsApi` - моковый jsApi, определенный во встроенном приложении. Если передан, то переопределит стандартные функции jsApi - [Переопределение методов jsApi](#mockJsApi)
- `params?: InitVariable` - Дополнительные параметры инициализации (Для тестирования вне SMP)

Пример:

```typescript
import {initializeJsApi} from '@nsmp/js-api';

// В режиме разработки будут использоваться методы jsApi, которые определены в пакете @nsmp/js-api
initializeJsApi()
  .then(() => {
     // Рендер приложения
  })
  .catch((e) => {
    console.error(e)
  })
```

Или

```typescript
import {initializeJsApi} from '@nsmp/js-api';
import mockJsApi from 'mocks/mockJsApi';

// В режиме разработки методы из переменной mockJsApi переопределят методы jsApi, которые есть в библиотеке
initializeJsApi(mockJsApi)
  .then(() => {
     // Рендер приложения
  })
  .catch((e) => {
    console.error(e)
  })
```

[К содержанию](#table-of-contents)

## Переопределение методов jsApi <a name="mockJsApi"></a>

В пакете есть возможность переопределить стандартные методы. Для этого необходимо создать переменную в проекте, которая будет хранить новые значения методов jsApi, например:

```typescript
import {PartialJsApi} from '@nsmp/js-api';

// При работе с TypeScript указан тип PartialJsApi
const mockJsApi: PartialJsApi = {
	extractSubjectUuid () {
		return 'subjectUuid$123';
	},
	findContentCode () {
		return 'contentCode';
	},
	getCurrentUser () {
		return {
			uuid: 'user$123'
		};
	},
	urls: {
		objectCard: (uuid: string) => `/${uuid}`
	}
};
```

При работе с TypeScript переменной с моковыми методами jsApi можно указать тип PartialJsApi из данного пакета - [Типизация jsApi](#types)

[К содержанию](#table-of-contents)

## Типизация jsApi <a name="types"></a>

В пакете определены типы для методов jsApi для разработки приложений с использованием TypeScript:
- `JsApi` - содержит все методы jsApi. При его использовании необходимо задать все методы, которые определены в пакете jsApi, все методы будут заменены новыми
- `PartialJsApi` - также содержит все методы jsApi. Но при его использовании можно задать только те методы, которые необходимо переопределить, остальные методы останутся без изменений

Если нужно создать моки с частичным переопределением функций, а затем передать их в `initializeJsApi`, следует использовать тип `PartialJsApi` при создании моков.

Пример:

```typescript
import {PartialJsApi} from '@nsmp/js-api';

const mock: PartialJsApi = {
  extractSubjectUuid () {
    return 'subjectUuid$123';
  },
  findContentCode () {
    return 'contentCode';
  },
}

initializeJsApi(mock)
```

[К содержанию](#table-of-contents)

## Настройка проксирования запросов <a name="proxy"></a>
Пакет имеет возможность проксирования запросов в режиме локальной разработки приложения. Чтобы проксирование запросов работало правильно, необходимо указать параметры при инициализации 

> Настройчего рекомендуем использовать переменные окружения для указания параметров инициализации jsApi
> `MODE = import.meta.env.MODE`
> `ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY`

Пример:

```typescript
import { initializeJsApi, InitVariable} from '@nsmp/js-api'

const mockJsApi = {}
const params = new InitVariable(
  "MODE",         // Выбор окружения для запуска
  "ACCESS_KEY",   // Ключ доступа для REST запросов
  "APP_URL",      // URL стенда
  "APP_CODE",     // Код ВП, примеч. код ВП и код контента должны совпадать
  "REST_PATH",    // Путь REST запроса (rest или earest)
  "SUBJECT_UUID", // Идентификатор объекта, на котором выведено ВП
  "USER_LOGIN",   // Логин пользователя
  "USER_UUID"     // Идентификатор пользователя
)

initializeJsApi(mockJsApi, params)
  .then(() => {
    // Рендер приложения
  })
  .catch((e) => {
    console.error(e)
  })
```

Для указания режима проксирования необходимо изменить строку запуска `dev` режима приложения в файле package.json

##### Webpack:
```json 
"dev": "cross-env NODE_ENV=development webpack serve --mode=development --config ./webpack/config.js"
```
Изменить на: 
```json 
"dev": "cross-env NODE_ENV=development start-webpack-server --mode=development --config ./webpack/config.js --env ./dev.env"
```

`config` и `env` являются опциональными аргументами командной строки. Если они не указаны по стандарту будут браться пути:
- `config` - `./webpack/config.js`
- `env` - `./dev.env`

Команда `start-webpack-server` запускает webpack server с добавленным в него проксированием запросов и всеми переменными окружения из файла `dev.env`

##### Vite:

```json 
"dev": "vite"
```
Изменить на: 
```json 
"dev": "vite --mode development"
```

По умолчанию будут использоваться файлы `.env.[mode]`

[К содержанию](#table-of-contents)

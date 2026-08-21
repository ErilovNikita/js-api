# @minitwiks/js-api

TypeScript-библиотека с типизированным mock-слоем и инициализацией `jsApi` для встроенных приложений NSMP.

> [!NOTE]
> Это независимо поддерживаемая производная версия [`@nsmp/js-api`](https://www.npmjs.com/package/@nsmp/js-api).
> Пакет не является официальным проектом авторов `@nsmp/js-api` и не связан с ними организационно.

> [!WARNING]
> Последняя версия с обратной совместимостью — [`1.1.0`](https://github.com/minitwiks/nsmp-js-api-vue/releases/tag/v1.1.0).
> Версии начиная с `2.0.0` содержат критические изменения и не имеют обратную совместимость с API версии `1.1.0`.
> Перед обновлением на `2.x` и выше проверьте migration notes и адаптируйте инициализацию, типы и импорты проекта.

## Возможности

- TypeScript API и декларации типов
- локальный mock `jsApi` для разработки и тестов
- глубокое переопределение отдельных методов через `PartialJsApi`
- автоматическое создание `InitVariable` из ENV
- несколько ENV-ключей для каждого параметра с приоритетом первого непустого значения
- поддержка Vite `import.meta.env`
- подключение настоящего `jsApi` в production NSMP через `window.parent.injectJsApi`
- mock-реализации команд, форм, REST, URL, utils и WebSocket API
- сборка в ESM и CommonJS
- Jest-тесты и отдельная генерация `.d.ts`

## Установка

```bash
npm install @minitwiks/js-api
```

Пакет не требует кастомных зависимостей.

Его можно использовать в Vue, React, Svelte или обычном браузерном приложении.

## Быстрый старт

### Vite и локальная разработка

Vite передаёт переменные окружения через `import.meta.env`. Передайте их в фабрику `createInitVariableFromEnv`:

```typescript
import {createApp} from 'vue'
import App from './App.vue'
import {
  createInitVariableFromEnv,
  initializeJsApi
} from '@minitwiks/js-api'

const params = createInitVariableFromEnv(import.meta.env)

initializeJsApi({}, params)
  .then(jsApi => {
    const app = createApp(App)

    app.provide('jsApi', jsApi)
    app.mount('#app')
  })
  .catch((error: unknown) => {
    console.error(error)
  })
```

В локальном браузерном запуске без `window.parent.injectJsApi` библиотека использует mock-реализацию.

### Production внутри NSMP

Если приложение запускается внутри NSMP, а родительское окно предоставляет `injectJsApi`, можно вызвать:

```typescript
import {initializeJsApi} from '@minitwiks/js-api'

initializeJsApi().then(jsApi => {
  // Рендер приложения после подключения настоящего jsApi
})
```

В production библиотека вызывает `window.parent.injectJsApi(window.parent, window)`.

### Явный production-режим

Для явного указания режима передайте `InitVariable`:

```typescript
import {InitVariable, initializeJsApi} from '@minitwiks/js-api'

const params = new InitVariable(
  'production',
  '',
  '',
  '',
  ''
)

initializeJsApi({}, params)
```

Если `injectJsApi` отсутствует, явный production-запуск завершится понятной ошибкой.

## ENV-конфигурация

### Стандартные соответствия

Таблица экспортируется из `initVariableEnvMapping`:

| `InitVariable` | ENV-ключи по приоритету |
| --- | --- |
| `MODE` | `MODE`, `NODE_ENV` |
| `ACCESS_KEY` | `ACCESS_KEY`, `VITE_ACCESS_KEY` |
| `APP_URL` | `APP_URL`, `VITE_APP_URL`, `REAL_APP_URL` |
| `APP_CODE` | `APP_CODE`, `VITE_APP_CODE` |
| `REST_PATH` | `REST_PATH`, `VITE_REST_PATH` |
| `SUBJECT_UUID` | `SUBJECT_UUID`, `VITE_SUBJECT_UUID` |
| `USER_LOGIN` | `USER_LOGIN`, `VITE_USER_LOGIN` |
| `USER_UUID` | `USER_UUID`, `VITE_USER_UUID` |
| `USER_ADMIN` | `USER_ADMIN`, `VITE_USER_ADMIN` |
| `USER_LICENSED` | `USER_LICENSED`, `VITE_USER_LICENSED` |
| `USER_CONCURRENT_LICENSED` | `USER_CONCURRENT_LICENSED`, `VITE_USER_CONCURRENT_LICENSED` |
| `USER_TITLE` | `USER_TITLE`, `VITE_USER_TITLE` |
| `USER_PROFILES` | `USER_PROFILES`, `VITE_USER_PROFILES` |
| `USER_ROLES` | `USER_ROLES`, `VITE_USER_ROLES` |

Используется первое непустое значение. Для boolean-полей значения `true`, `1`, `yes` и `on` преобразуются в `true`, остальные заданные значения в `false`.

### Пример `.env.development`

```env
VITE_ACCESS_KEY=local-token
VITE_APP_URL=http://localhost:5173/
VITE_APP_CODE=my-embedded-app
VITE_REST_PATH=rest
VITE_SUBJECT_UUID=subject-uuid
VITE_USER_UUID=user-uuid
VITE_USER_LOGIN=developer
VITE_USER_ADMIN=false
```

### Собственная таблица соответствий

Можно задать свои имена ENV-ключей, сохранив остальные значения по умолчанию:

```typescript
import {
  createInitVariableFromEnv,
  initVariableEnvMapping,
  initializeJsApi
} from '@minitwiks/js-api'

const mapping = {
  ...initVariableEnvMapping,
  APP_URL: ['MY_APP_URL', 'APP_URL', 'VITE_APP_URL']
}

const params = createInitVariableFromEnv(import.meta.env, mapping)
initializeJsApi({}, params)
```

## Mock и переопределение методов

`initializeJsApi` принимает частичный mock. Указанные методы заменяют только соответствующие методы стандартного mock:

```typescript
import {initializeJsApi, type PartialJsApi} from '@minitwiks/js-api'

const mock: PartialJsApi = {
  extractSubjectUuid: () => 'subject-uuid$123',
  findContentCode: () => 'content-code',
  getCurrentUser: () => ({
    uuid: 'user-uuid',
    admin: true,
    licensed: true,
    concurrentLicensed: false,
    login: 'developer',
    title: 'Developer',
    operatorLogo: '',
    profiles: ['administrator'],
    roles: ['ROLE_ADMIN']
  }),
  urls: {
    objectCard: uuid => `/objects/${uuid}`
  }
}

initializeJsApi(mock)
```

Вложенные объекты объединяются глубоко, поэтому переопределение `urls.objectCard` не заменяет остальные URL-методы.

## Основной API

После инициализации доступен объект `jsApi` со следующими группами:

| Группа | Назначение |
| --- | --- |
| `commands` | переход к карточке, quick add/edit и выбор объекта |
| `configuration` | вызов методов конфигурации |
| `contents` | размеры iframe, параметры контента и высота приложения |
| `eventActions` | выполнение пользовательского действия по событию |
| `events` | подписки на изменения полей, объекта и permissions |
| `forms` | тип формы, значения, смена состояния и ответственного |
| `modals` | информация о модальном окне и `DialogBuilder` |
| `page` | размеры страницы и заголовка |
| `requests` | JSON- и текстовые запросы |
| `urls` | генерация URL NSMP |
| `utils` | mock CRUD и параметры поиска |
| `ws` | mock WebSocket-команды |

Также доступны методы `getAppBaseUrl`, `getAppRestBaseUrl`, `getCurrentUser`, `getCurrentLocale`, `getViewMode`, `getWebViewType`, `extractSubjectUuid`, `findApplicationCode`, `findContentCode`, `isAddForm`, `isEditForm`, `isOnObjectCard`, `restCall`, `restCallAsJson` и `restCallModule`.

### REST-запросы

```typescript
const response = await window.jsApi.restCallAsJson<{items: string[]}>('/objects', {
  method: 'GET'
})

const text = await window.jsApi.restCall('/health', {
  method: 'GET'
})
```

Для `requests.json` и `restCallAsJson` ответ разбирается через `JSON.parse`. `restCall` и `requests.make` возвращают текстовый ответ. `responseType: 'blob'` и `responseType: 'arraybuffer'` поддерживаются mock-слоем.

### Параметры utils

```typescript
const params = window.jsApi.utils
  .buildParams()
  .ignoreCase()
  .limit(20)
  .offset(0)
  .attrs(['title', 'state'])

const object = await window.jsApi.utils.get('object-uuid', params)
```

## TypeScript

Основные экспортируемые типы:

- `IJsApi` — полный контракт API
- `PartialJsApi` — рекурсивно частичный контракт для mock-объектов
- `InitVariable` — параметры инициализации
- `Environment` — объект ENV для `createInitVariableFromEnv`
- `InitVariableEnvMapping` — тип таблицы соответствий
- типы REST, форм, атрибутов, WebSocket и dialog API

```typescript
import type {IJsApi, PartialJsApi} from '@minitwiks/js-api'
```

## Сборка и тесты

Установить зависимости:

```bash
npm install
```

Проверить TypeScript:

```bash
npm run typecheck
```

Запустить Jest:

```bash
npm test
```

Собрать ESM, CommonJS и декларации:

```bash
npm run build
```

Результат сборки находится в `dist`:

```text
dist/index.js
dist/index.cjs
dist/index.d.ts
```

## Структура проекта

```text
src/
  api/       runtime jsApi и initializeJsApi
  config/    ENV mapping и фабрика InitVariable
  core/      классы и deep merge
  types/     публичные TypeScript-контракты
  tests/     Jest-тесты
  index.ts   публичный entrypoint
```

## Ограничения

- `initializeJsApi` и mock-методы используют browser API: `window`, `document`, `fetch`, `alert`, `confirm` и `window.open`.
- Для SSR импорт типов безопасен, но вызывать `initializeJsApi` следует только на клиенте.
- Реальный production API доступен только внутри NSMP, где родительское окно предоставляет `injectJsApi`.
- В локальном режиме mock-методы имитируют поведение API и не заменяют настоящий backend NSMP.

## Лицензия

MIT. Подробности находятся в [LICENSE](LICENSE).
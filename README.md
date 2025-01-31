# WhatsApp Web Клиент

Веб-клиент WhatsApp, построенный на React и Material-UI с использованием Green API для интеграции с WhatsApp.

## Возможности

- 💬 Обмен сообщениями в реальном времени
- 🌙 Темная/Светлая тема
- 📱 Адаптивный дизайн
- ⚡ Быстрая и легкая работа
- 🔒 Безопасная интеграция с API
- 📝 История сообщений
- 👥 Управление контактами

## Требования

Перед началом работы убедитесь, что у вас установлены:
- Node.js (версия 14 или выше)
- npm или yarn
- Аккаунт Green API с Instance ID и API Key

## Локальная установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/Russolnik/Green-Api_TEST.git
cd Green-Api_TEST
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
```

3. Запустите проект в режиме разработки:
```bash
npm start
# или
yarn start
```
Приложение будет доступно по адресу: http://localhost:3000

## Сборка и деплой

### Локальная сборка

1. Создайте продакшн-сборку:
```bash
npm run build
# или
yarn build
```

2. Для запуска собранной версии локально:
```bash
# Установите глобально serve (если еще не установлен)
npm install -g serve

# Запустите собранную версию
serve -s build
```
Приложение будет доступно по адресу: http://localhost:3000

### Размещение на хостинге

Вы можете разместить содержимое папки `build` на любом статическом хостинге:

#### Vercel
1. Установите Vercel CLI:
```bash
npm install -g vercel
```
2. Деплой:
```bash
vercel
```

#### Netlify
1. Создайте аккаунт на Netlify
2. Перетащите папку `build` в раздел "Sites" на сайте Netlify
   или используйте Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy
```

#### GitHub Pages
1. В `package.json` добавьте:
```json
{
  "homepage": "https://username.github.io/repository-name"
}
```
2. Установите gh-pages:
```bash
npm install --save-dev gh-pages
```
3. Добавьте скрипты в `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```
4. Деплой:
```bash
npm run deploy
```

## Настройка

1. Получите учетные данные Green API:
   - Instance ID
   - API Key
   - Зарегистрируйтесь на [Green API](https://green-api.com/)

2. Введите эти данные в настройках приложения после запуска

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на наличие ошибок
2. Убедитесь, что все зависимости установлены
3. Проверьте правильность учетных данных Green API
4. Создайте issue в репозитории проекта

## Лицензия

Проект распространяется под лицензией MIT

const fullPath = [window.location.origin, window.location.pathname].join('');
const rootPath = fullPath
  .replace('dist/index.html', '')
  .replace('dist/index.php', '')
  .replace('index.html', '')
  .replace('index.php', '');

export default {
  global: {
    appName: window.appName,
    appNameEng: window.appNameEng,
    appCodeName: window.appCodeName,
    appDirName: window.appDirName,
    archiveName: window.archiveName,
    isDev: window.isDev,
    isProd: window.isProd,
    isWatch: window.isWatch,
  },
  path: {
    root: rootPath,
    handler: fullPath,
    ajaxUrl: `${rootPath}ajax/`,
  },
  steps: [
    {
      name: 'Сбор требований',
      path: '/',
    },
    {
      name: 'Генерация КП',
      path: '/offer-page',
    },
    {
      name: 'Генерация задач',
      path: '/tasks-page',
    },
  ],
  buttonName: 'Расценить >>',
  prefix: 'CRM: РАСЦЕНКА - ', // шаблон заголовка
  rate: 1000, // ставка часа
  priceHour: 'UF_PRICE_HOUR', // кастомное поле Ставка часа
  planFact: 'UF_AUTO_378273429767', // кастомное поле План=Факт
};

export type StepType = {
  name: string;
  path: string;
};

export const steps: StepType[] = [
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
];

export default {
  buttonName: 'Расценить >>',
  prefix: 'CRM: РАСЦЕНКА - ', // шаблон заголовка
  rate: 1000, // ставка часа
  priceHour: 'UF_PRICE_HOUR', // кастомное поле Ставка часа
  planFact: 'UF_PLAN_FACT', // кастомное поле План=Факт
};

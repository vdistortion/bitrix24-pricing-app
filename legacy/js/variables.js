var constant = {
      RATE: '670', // ставка часа
      PREFIX: 'CRM: РАСЦЕНКА - ', // шаблон заголовка
      RUN_AGAIN: 'Что-то пошло не так!',
      SUCCESS_TASK: 'Готово'
    };
var ess = {
      root: $('.js-root'), // корень
      error: $('.js-errors'), // поле для показа ошибок
      dealLink: $('.js-deal-link'), // сделка
      dealSelect: $('.js-deal-select'), // кнопка выбора сделки
      dealDelete: $('.js-deal-del'), // кнопка удаления сделки
      managerLink: $('.js-manager-link'), // менеджер
      managerSelect: $('.js-manager-select'), // кнопка выбора менеджера
      managerDelete: $('.js-manager-del'), // кнопка удаления менеджера
      devLink: $('.js-dev-link'), // разработчик
      devSelect: $('.js-dev-select'), // кнопка выбора разработчика
      devDelete: $('.js-dev-del'), // кнопка удаления разработчика
      deadline: $('.js-deadline'), // дата дедлайна
      taskTitle: $('.js-title'), // название задачи
      description: $('.js-description'), // описание задачи
      uploadFiles: $('.js-upload-files'), // выбрать файлы
      taskCreate: $('.js-task-create'), // кнопка создания задачи
      taskLink: $('.js-task-link') // созданная задачи
    };
var phase2 = {
      getTaskTitle: $('.js-get-tasktitle'), // js-tasktitle
      getDescription: $('.js-get-description'), // js-getdescription
      table: $('.js-table'), // root
      line: $('.js-line'), // line
      task: $('.js-task'), // task
      time: $('.js-time'), // time
      message: $('.js-message'), // message
      deleteLine: $('.js-delete-line'), // delete-line
      createLine: $('.js-create'), // create
      savedList: $('.js-saved-list'), // #div
      savePrice: $('.js-save'),
      done: $('.js-done'), // js-manager
      priceItem: $('.js-price-item'), // template__new-button>span
      priceButton: $('.js-price-item-button'), // [role="button"]
      deletelement: $('.js-deletelement')
    };
var app = ess.root.attr('data-app-id');
var getDealID = ess.root.attr('data-deal-id');
var getTaskID = ess.root.attr('data-task-id');
var getUserID = ess.root.attr('data-user-id');
var getSaveID = ess.root.attr('data-save-id');

var getFullPathToApp = function(file) {
  return "https://szdl.ru/app/pricing-update/" + file;
}
var isTeamPortal = function() {
  return BX24.getDomain() === "team.bitrix24.ru";
}
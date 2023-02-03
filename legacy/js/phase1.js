// Выбор сделки
ess.dealSelect.on('click', windowDealSelect);

// Удаление сделки
ess.dealDelete.on('click', dealDelete);

// Выбор менеджера
ess.managerSelect.on('click', windowManagerSelect);

// Удаление менеджера
ess.managerDelete.on('click', managerDelete);

// Удаление разработчика
ess.devDelete.on('click', devDelete);

// Создание задачи
ess.taskCreate.on('click', newTask);

$(function(){

  // Автоматическая подгрузка сделки
  setTimeout(autoDetectDeal, 1000);

  // Инициализируем air
  ess.deadline.datepicker({
    autoClose: true,
    timepicker: true,
    position: "right center",
    dateFormat: 'yyyy-mm-dd',
    timeFormat: 'hh:ii',
    minDate: new Date()
  });

  // Инициализируем загрузчик файлов
  uploadObj = ess.uploadFiles.uploadFile({
    url: "scripts/ajax/uploadFilesAJAX.php",
    fileName: "files",
    showFileCounter: false,
    autoSubmit: false,
    multiple: true,
    abortStr: "загружается",
    dynamicFormData: function(){
      var data = {
        domain: BX24.getAuth().domain,
        token: BX24.getAuth().access_token,
        id: resultAnswerResult
      };
      return data;
    },
    onLoad: function(files){
      setTimeout("BX24.fitWindow()", 1);
    },
    onSelect: function(files){
      setTimeout("BX24.fitWindow()", 1);
    }
  });

});

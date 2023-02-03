// Только цифры и точки
$('.counter__input').bind("change keyup input click", function() {
  if(this.value.match(/[^0-9\.]/g)){
    this.value = this.value.replace(/[^0-9\.]/g, '');
  }
});

// Добавляем строку
$('.js-create').on("click", addLine);

// Добавляем строку
$('.js-group').on("click", addGroup);

// Удаляем строку
$('.js-delete-line').on("click", removeLine);

// Сохраняем расценку
$('.js-save').on("click", saveElement);

// Подгружаем расценку
$('.js-saved-list').on("click", '[role="button"]', loadPrice);

// Удаляем расценку
$('.js-saved-list').on("click", '.js-deletelement', deleteElement);

// Закрываем расценку
$('.js-done').on("click", priceDone);

$('.js-table tbody').on("DOMSubtreeModified", function () {
  var timeCounter = 0;
  $('.js-table tr').each(function(){
    if($(this).hasClass('js-line')){
        timeCounter += Number($(this).find('.js-time').val());
    }
  });
  $('.js-time-all').html(timeCounter);
});

$('.js-time').on("change paste keyup",function () {
  var timeCounter = 0;
  $('.js-table tr').each(function(){
    if($(this).hasClass('js-line')){
        timeCounter += Number($(this).find('.js-time').val());
    }
  });
  $('.js-time-all').html(timeCounter);
});

$(function(){

  // jquery-ui
  $('.js-table tbody').sortable();
  $('.js-table tbody').on("sortupdate", countGroup);

  // Счётчик
  counter();

  // Заголовок
  BX24.callMethod(
    'task.item.getdata',
    [getTaskID],
    function(result)
    {
      phase2.getTaskTitle.html(result.data().TITLE + '').attr('href', 'https://'+BX24.getAuth().domain+'/company/personal/user/'+getUserID+'/tasks/task/view/'+getTaskID+'/');
      ess.root.attr('data-deal-id', result.data().UF_CRM_TASK[0].substr(2));
    }
  );

  // Описание
  BX24.callMethod(
   'task.item.getdescription',
   [getTaskID, 2],
   function(result)
    {
      phase2.getDescription.html(result.data()).find('.quote').remove();
    }
  );

  // Подгружаем расценки
  $.post(
    "scripts/ajax/ajax_daj.php",
    {
      task: getTaskID,
      user: getUserID
    },
    onAjaxDaj
  );

});

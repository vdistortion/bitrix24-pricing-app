// Получаем id приложения
function getAppID(){
  BX24.callMethod('app.info', {
    AUTH: BX24.getAuth().domain+'/rest/app.info?auth='+BX24.getAuth().access_token
  }, function(res){
    ess.root.attr('data-app-id', res.answer.result.ID);
  });
}

// Автоматическая подгрузка сделки
function autoDetectDeal(){
  var contextInfo = BX24.placement.info();
  if(contextInfo.options && contextInfo.options.ID){
    getDeal(contextInfo.options.ID);
    // $('.bc-hidden').hide();
    $('.js-btn-phase1').addClass('prc-breadcrumbs__phase--focus');
  }else if(getDealID){
    getDeal(getDealID);
  }else{
    console.log('Что-то нет сделки. ):');
  }
}


/******* Этап 1 *******/

// Окно выбора сделки
function windowDealSelect(){
  BX24.selectCRM({
    entityType: ['deal']
  }, function(result){
    getDealID = result.deal[0].id.substring(2);
    ess.root.attr('data-deal-id', getDealID);
    getDeal(getDealID);
  });
}

// Удаление сделки
function dealDelete(){
  $(this).parent().hide();
  ess.dealLink.text('').attr('href', '');
  ess.dealSelect.text('Выбрать');
  ess.root.removeAttr('data-deal-id');
}

// Окно выбора менеджера
function windowManagerSelect(){
  BX24.selectUser(function(result){
    ess.root.attr('data-manager-id',result.id);
    var href = 'https://'+BX24.getAuth().domain+'/company/personal/user/'+ess.root.attr('data-manager-id')+'/';
    ess.managerLink.attr('href', href).text(result.name).parent().show();
    ess.managerSelect.text('Сменить');
  });
}

// Удаление менеджера
function managerDelete(){
  $(this).parent().hide();
  ess.managerLink.text('').attr('href', '');
  ess.managerSelect.text('Выбрать');
  ess.root.removeAttr('data-manager-id');
}

// Окно выбора разработчика
function windowDevSelect(then, user){
  BX24.selectUser(function(result){
    then.attr('data-dev-id',result.id);
    ess.root.attr('data-dev-id',result.id);
    var href = 'https://'+BX24.getAuth().domain+'/company/personal/user/'+ess.root.attr('data-dev-id')+'/';
    user.attr('href', href).text(result.name).parent().show();
    then.text('Сменить');
  });
}

// Удаление разработчика
function devDelete(){
  $(this).parent().hide();
  ess.devLink.text('').attr('href', '');
  ess.devSelect.text('Выбрать');
  ess.root.removeAttr('data-dev-id');
}

// Получаем сделку
function getDeal(deal){
  BX24.callMethod("crm.deal.get", { id: deal }, function(result){
    if(result.error()){
      // заблокировать taskCreate, вывести ошибку
      // App.ess.taskCreate.attr('disabled','disabled');
      // App.ess.err.text(App.constant.ERROR_CREATE_TASK).show();
      BX24.fitWindow();
    }else{
      ess.root.attr('data-deal-id', deal);
      // сформировать ссылку на сделку, получить постановщика из сделки
      var href = 'https://'+BX24.getAuth().domain+'/crm/deal/show/'+result.data().ID+'/';
      // App.ess.taskCreate.removeAttr('disabled').find('span').text(App.constant.CREATE_TASK);
      ess.root.attr('data-manager-id', result.data().ASSIGNED_BY_ID);
      ess.dealLink.attr('href', href).text(result.data().TITLE).parent().show();
      ess.dealSelect.text('Сменить');
      getUser(ess.root.attr('data-manager-id'));
      // App.ess.deal.parents('.task-form-field').find(App.ess.dealSelect).text('Сменить');
    }
  });
}

// Получаем имя ответственного менеджера из сделки
function getUser(id){
  BX24.callMethod('user.get', { ID: id }, function(result){
    if(result.data()){
      var user = result.data()[0],
          href = 'https://'+BX24.getAuth().domain+'/company/personal/user/'+id+'/';
      if(!!user){
        ess.managerLink.attr('href', href).text(user.NAME + ' ' + user.LAST_NAME).parent().show();
        ess.managerSelect.text('Сменить');
      }
    }
  });
}

// Создаём новую задачу
function newTask(){
  let err = $('.js-title-error');
  let isErr = false;
  err.html("");
  if(ess.taskTitle.val() === ""){
    err.append("<li>Введите название задачи</li>");
    ess.taskTitle.parent().css("border","2px solid red");
    isErr = true;
  }
  if(ess.root.attr('data-manager-id') === undefined) {
    err.append("<li>Выберите постановщика</li>");
    isErr = true;
  }
  if(ess.root.attr('data-dev-id') === undefined) {
    err.append("<li>Выберите ответственного</li>");
    isErr = true;
  }
  if(ess.root.data('deal-id') === undefined) {
    err.append("<li>Выберите сделку</li>");
    isErr = true;
  }

  if (isErr) {
    return;
  }

  ess.taskTitle.parent().css("border","none");
  ess.taskTitle.parent().css("border-bottom","1px solid #edeef0");

  BX24.callMethod(
    'task.item.add',
    [{TITLE: constant.PREFIX+ess.taskTitle.val(),
      DESCRIPTION: ess.description.val(),
      UF_PRICE_HOUR: constant.RATE, // ставка часа, пользовательское
      UF_AUTO_378273429767: 1, // план = факт, пользовательское
      ALLOW_TIME_TRACKING: "Y",
      TIME_ESTIMATE: 900, // плановое время 15 минут (60*60/4)
      TASK_CONTROL: 'Y', // задача закрывается на контроль
      CREATED_BY: ess.root.attr('data-manager-id'),
      RESPONSIBLE_ID: ess.root.attr('data-dev-id'),
      DEADLINE: ess.deadline.val().substr(0,10)+'T'+ess.deadline.val().substr(-5)+':00+03:00',
      UF_CRM_TASK: ["D_"+ess.root.data('deal-id')]}],
    function(result){
      if(result.error()){
        ess.error.text(constant.RUN_AGAIN).show();
        BX24.fitWindow();
      }else{
        resultAnswerResult = result.answer.result;
        uploadObj.startUpload();

        var href = 'https://'+BX24.getAuth().domain+'/company/personal/user/'+ess.root.attr('data-dev-id')+'/tasks/task/view/'+result.answer.result+'/';
        ess.taskLink.attr('href', href).text(result.query.data[0].TITLE);
        ess.taskCreate.text(constant.SUCCESS_TASK);
        var ttt = ess.root.attr('data-dev-id');
        ess.root.removeAttr('data-dev-id');
        ess.root.removeAttr('data-manager-id');
        var appid = ess.root.attr('data-app-id');

        BX24.callMethod(
          'task.item.update',
          [result.answer.result, {DESCRIPTION: "[QUOTE][URL="+'https://'+BX24.getAuth().domain+"/marketplace/app/"+appid+"/?phase=2&task="+result.answer.result+"&user="+ttt+"]Расценить >>[/URL][/QUOTE]"+ess.description.val()}],
          function(result){
            // console.info(result.data());
          }
        );
            console.info(result.query.data[0].TITLE);
            console.info(result.answer.result);
            console.info(ess.dealLink.text());
            console.info(ess.root.data("deal-id"));

        $.ajax({
          url: 'scripts/ajax/iBlockSave.php',
          type: 'post',
          data: {
            taskName: result.query.data[0].TITLE,
            taskId: result.answer.result,
            dealName: ess.dealLink.text(),
            dealId: ess.root.data("deal-id")
          },
          dataType: 'text',
          success: function(ans){
            console.log('success');
            console.log(ans);
          },
          error: function(ans){
            console.log('error');
            console.log(ans);
          }
        });

      }
    }
  );
}


/******* Этап 2 *******/

// Счётчик
function counter(){
  $('.counter').each(function(){
    var control = $(this).find('.counter__control'),
        input = $(this).find('.counter__input');
    control.unbind('click');
    control.on('click',function(){
      var action = $(this).data('action'),
          value = parseFloat(input.val());
      if(action == "plus"){
        if(value < 8){
          value += 0.5;
        }else{
          value = 8;
        }
      }
      if(action == "minus"){
        if(value > 0){
          value -= 0.5;
        }else{
          value = 0;
        }
      }
        input.val(value);
        var timeCounter = 0;
        $('.js-table tr').each(function(){
            if($(this).hasClass('js-line')){
                timeCounter += Number($(this).find('.js-time').val());
            }
        });
        $('.js-time-all').html(timeCounter);
      countGroup();
    });
  });
};

// Тут должен взлетать вертолёт
function formatDate(date) {
  var d = (String(date).length == 1) ? '0'+ date : date;
  return d;
}

// Что-то сохраняем
function onAjaxSuccess(data){
  var mega_array = JSON.parse(data);
  $('.ui-sortable').html('');
  for(var i = 0; i < mega_array.length; i++){
    if(typeof mega_array[i]['task'] !== "undefined"){
      $('.template__new-line .js-time').val(1);
      var a = $('.template__new-line .js-line').clone(true);
      a.find('.js-task').val(mega_array[i]["task"]);
      a.find('.js-time').val(mega_array[i]["time"]);
      a.find('.js-message').val(mega_array[i]["message"]);
    }else{
      var a = $('.template__new-group .js-group-tr').clone(true);
      a.find('.js-group-name').val(mega_array[i]["groupName"]);
      a.find('.js-full').val(mega_array[i]["full"]);
    }
    a.appendTo('.ui-sortable');
    counter();
    BX24.fitWindow();
  }
}

// Что-то получаем
function onAjaxDaj(data){
  if(data != null && data.length > 0){
    var mega_array = JSON.parse(data);
    for(var i = 0; i < mega_array.length; i++){
      var a = $('.template__new-button .js-price-item').clone(true);
      a.find('[role="button"]')
       .addClass(mega_array[i]["class"])
       .text(mega_array[i]["name"]);
      a.prependTo('.js-saved-list');
    }
    setTimeout(getPrice, 1000);
  }
}

$('.js-price-item').on('click', function(){
  $('.js-price-item').not(this).removeAttr('style');
  $(this).css("background-color", "#bbed21");
});

// Подгружаем и раскрашиваем нужную расценку
function getPrice(){
  $('.'+getSaveID).trigger('click').parent().css("background-color", "#bbed21");
}

// Добавляем строку
function addLine(){
  $('.template__new-line .js-time').val(1);
  $('.template__new-line tr').clone(true).appendTo('.ui-sortable');
  counter();
  countGroup();
  BX24.fitWindow();
}

// Добавляем группу
function addGroup(){
  $('.template__new-group tr').clone(true).appendTo('.ui-sortable');
  countGroup();
  BX24.fitWindow();
}

// Пересчёт группы
function countGroup(){
  if($('.js-table .js-group-tr')){
    $('.js-table .js-group-tr').each(function(){
      var then = $(this),
          time = 0,
          full = then.find('.js-full'),
          plan = then.find('.js-plan'),
          kp = then.find('.js-kp');
      full.val(time);
      noname(then, time, full, '.js-time');
      console.log(plan);
      console.log(kp);
      if(plan.length){
        noname(then, time, plan, '.js-plan');
      }
      if(kp.length){
        noname(then, time, kp, '.js-kp');
      }
    });
  }

  // Считаем
  function noname(then, time, count, search){
    if(then.next().hasClass('js-line')){
      var next = then.next();
      time += +next.find(search).val();
      count.val(time);
      noname(next, time, count, search);
    }
  }
}

// Удаляем строку
function removeLine(){
  $(this).parents('tr').remove();
  if(!$('.ui-sortable').find('tr').length){
    $('.template__new-line .js-time').val(1);
    $('.template__new-line tr').clone(true).appendTo('.ui-sortable');
    counter();
  }
  countGroup();
}

// Сохраняем расценку
function saveElement(){
  var array = [];
  $('.js-table tr').each(function(){
    var then = $(this),
        object = {};
    if(then.hasClass('js-line')){
      var task = then.find('.js-task').val(),
          time = then.find('.js-time').val(),
          message = then.find('.js-message').val();
      object.task = task;
      object.time = time;
      object.message = message;
      array.push(object);
    }
    if(then.hasClass('js-group-tr')){
      var groupName = then.find('.js-group-name').val(),
          full = then.find('.js-full').val();
      object.groupName = groupName;
      object.full = full;
      array.push(object);
    }
  });

  // console.log(array);

  var str = JSON.stringify(array);

  var now = new Date(),
      now_class = now.getFullYear()
           + "" + now.getMonth()
           + "" + now.getDate()
           + "" + now.getHours()
           + "" + now.getMinutes()
           + "" + now.getSeconds()
           + "" + now.getMilliseconds(),
       now_text = formatDate(now.getDate())
          + "." + formatDate(now.getMonth())
          + "." + now.getFullYear()
          + " " + formatDate(now.getHours())
          + ":" + formatDate(now.getMinutes())
          + ":" + formatDate(now.getSeconds());

  var p = $('.template__new-button .js-price-item').clone(true);
  p.find('[role="button"]').addClass(now_class).text(now_text);
  $('.js-price-item').removeAttr('style');
  p.css("background-color", "#bbed21").prependTo('.js-saved-list');

  $.post(
    "scripts/ajax/ajax.php",
    {
      str: str,
      task: getTaskID,
      user: getUserID,
      class: now_class,
      name: now_text
    },
    onAjaxSuccess
  );

}

// Подгружаем расценку
function loadPrice(){
  $.post(
    "scripts/ajax/ajax_get.php",
    {
      class: $(this).attr('class'),
      name: $(this).text()
    },
    onAjaxSuccess
  );
}

// Удаляем расценку
function deleteElement(){
  $.post(
    "scripts/ajax/ajax_del.php",
    {
      class: $(this).prev().attr('class'),
      delete: true
    },
    onAjaxDelete
  );
  function onAjaxDelete(data){
    console.log('удалено');
  }
  $(this).parent().remove();
}

// Закрываем расценку
function priceDone(){
  $('.js-save').trigger("click");
  var idSave = $('.js-saved-list span:first-child [role="button"]').attr('class');
  var array = [];
  var calcTime = 0;
  $('.js-table tr').each(function(){
    var then = $(this),
        object = {};
    if(then.hasClass('js-line')){
      var task = then.find('.js-task').val(),
          time = then.find('.js-time').val(),
          message = then.find('.js-message').val();
      object.task = task;
      object.time = time;
      calcTime += Number(time);
      object.message = message;
      array.push(object);
    }
    if(then.hasClass('js-group-tr')){
      var groupName = then.find('.js-group-name').val(),
          full = then.find('.js-full').val();
      object.groupName = groupName;
      object.full = full;
      array.push(object);
    }
  });
  //'+BX24.getAuth().domain+'
  var string = '[url=https://'+BX24.getAuth().domain+'/marketplace/app/'+ess.root.attr('data-app-id')+'/?phase=2&task='+getTaskID+'&user='+getUserID+'&save='+idSave+']Расценка проекта[/url]\n[url=https://'+BX24.getAuth().domain+'/marketplace/app/'+ess.root.attr('data-app-id')+'/?phase=3&deal='+ess.root.attr('data-deal-id')+']Формирование КП[/url]\n\n[table][tr][th]Работа[/th][th]Время[/th][th]Комментарий[/th][/tr]';
  for(var i = 0; i < array.length; i++){
    if(typeof array[i]['task'] !== "undefined"){
      string += '[tr][td]'+array[i]["task"]+'[/td][td]'+array[i]["time"]+'[/td][td]'+array[i]["message"]+'[/td][/tr]';
    }else{
      string += '[tr][th]Группа работ:[/th][th]'+array[i]["groupName"]+'[/th][th]'+array[i]["full"]+'[/th][/tr]';
    }
  }
  string += '[/table]\n\nИтого, часов: '+calcTime;
  BX24.callMethod(
      'task.commentitem.add',
      [getTaskID, {'POST_MESSAGE': string}],
      function(result){
        // console.info(result.data());
      }
  );
  BX24.callMethod(
      'task.item.complete',
      [getTaskID],
      function(result){
        // console.info(result.data());
      }
  );
  $(this).text('Задача закрыта')
}


/******* Этап 3 *******/

// Берём все расценки по сделке
function getPricingList(data){
  // $('#loader').show();

  JSON.parse(data).forEach(function(item){
    if(item["SERIALIZE"].length){
      console.log(item);
      var arrayData = JSON.parse(item["SERIALIZE"][item["SERIALIZE"].length - 1]),
          arrayTask = item["TASK"],
          container = $('.template .prc-welldone').clone(true);

      BX24.callMethod('task.item.getdata', [arrayTask], function(result){
        var title = result.data()["TITLE"],
            id = result.data()["RESPONSIBLE_ID"],
            name = result.data()["RESPONSIBLE_NAME"],
            lastname = result.data()["RESPONSIBLE_LAST_NAME"],
            linkUser = 'https://'+BX24.getAuth().domain+'/company/personal/user/'+id+'/',
            link = linkUser+'tasks/task/view/'+arrayTask+'/';
        container.find('.js-title').attr('href', link).text(title);
        container.find('.js-name').attr('href', linkUser).text(name + " " + lastname);
      });

      arrayData.forEach(function(item){
        if(typeof item['task'] !== "undefined"){
          var row = $('.template .table .js-line').clone(true);

          row.find('.js-task').val(item["task"]);
          row.find('.js-time').val(item["time"]);
          row.find('.js-kpt').val(item["time"]);
          if(item["message"]){
            row.find('.js-message').attr('title', item["message"]).find('input').css({'background-color': '#eef2f4'});
          }
          row.appendTo(container.find('.js-pricing'));
        }else{
          var row = $('.template .table .js-group-tr').clone(true);

          row.find('.js-group-name').val("Группа работ: "+item["groupName"]);
          row.find('.js-full').val(item["full"]);
          row.appendTo(container.find('.js-pricing'));
        }

        container.appendTo('.table-list');
      });
    }
  

  });
  $(function(){
    BX24.fitWindow();
    $('.js-table tbody').sortable();
    if($('.js-rate').val()){
      countGroup();
      calcPricingList('.js-plan', '.js-total-plan');
      calcPricingList('.js-kp', '.js-total-kp');
    }
  });

  // $('#loader').hide();
}

// Подсчёт общей суммы
function calcPricingList(target, itogo){
  var times = $('table.enabled').find('.js-time'),
      kptimes = $('table.enabled').find('.js-kpt'),
      totalTime = $('.js-total-time'),
      rate = $('.js-rate').val(),
      result = $(itogo),
      ct = 0,
      c = u = 0;

  kptimes.each(function () {
      var kpt = +$(this).val();
      ct += kpt;
      $('.js-total-kpt').val(ct);
  });

  times.each(function(){
    var time = +$(this).val(),
        params = $(this).parents('tr').find(target);
        noGroup = $(this).parents('.js-line').find(target);
    c += time;
    totalTime.val(c);
    params.val(+rate * time);
    noGroup.each(function(){
      var w = +$(this).val();
      u += w;
      result.val(u);
    });
  });
  $('.js-itogo').val('Итого:');
  $('#naz').val(+$('.js-total-kp').val() - +$('.js-total-plan').val());
}

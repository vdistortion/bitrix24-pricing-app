$(function(){

  //Вешаем обработчик на показ приложения в карточке сделки
  BX24.callMethod(
    "placement.get",
      {},
      function(result){
        var curPlacement = result.data();
        if(curPlacement.length == 0) {
          BX24.callMethod(
            "placement.bind",
            {
              "PLACEMENT": "CRM_DEAL_DETAIL_TAB",
              "HANDLER": "https://szdl.ru/app/pricing/index.php",
              "TITLE": "Расценка"
            }
          );
        }
    }
  );

  // Хлебные крошки
  $.getJSON('data/content.json', function(data){
    var len = data.menu.length - 1;
    $.each(data.menu, function(key, val){
      var order = key + 1;
      var phase = $('.js-root').data('phase');
      var a = $('.template .prc-bc a').clone(true)
      a.addClass('js-btn-phase' + order).attr('href', val.link).text(val.name);
      if(val.hidden) a.addClass('bc-hidden');
      if(order == phase){
        a.addClass('prc-breadcrumbs__phase--focus');
      }
      a.appendTo('.prc-breadcrumbs');
      if(key !== len){
        var s = $('.template .prc-bc span').clone(true);
        s.appendTo('.prc-breadcrumbs');
        if(val.hidden) s.addClass('bc-hidden');
      }
    });
  });

  // Выбор разработчика
  ess.devSelect.on('click', function(){
    var then = $(this);
    var user = then.parents('.task-form-field').find('.js-dev-link');
    windowDevSelect(then, user);
  });

  // Заголовок из тайтла
  BX24.setTitle(document.title);

  // Убираем скролл фрейма
  BX24.fitWindow();

  // Узнаём id приложения
  getAppID();

  function functionNoname(step){
    $('.prc-breadcrumbs').on('click', '.js-btn-phase' + step, function(){
      var contextInfo = BX24.placement.info();
      if(contextInfo.options && contextInfo.options.ID){
        document.location.href = "phase" + step + ".php?phase=" + step + "&view=deal&deal="+contextInfo.options.ID;
      }else if(getDealID){
        document.location.href = "phase" + step + ".php?phase=" + step + "&deal="+getDealID;
      }else{
        console.log('Что-то нет сделки. ):');
      }
    });
  }

  functionNoname(1);
  functionNoname(3);
  functionNoname(4);
  // $('#loader').hide();

});

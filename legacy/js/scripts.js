$(function(){
  //Вешаем обработчик на показ приложения в карточке сделки
  BX24.callMethod(
    "placement.get",
      {},
      function(result){
        var curPlacement = result.data() || [];
        console.log(curPlacement);
        var isCrmPlacement = curPlacement.find(function(current) {
          return current.placement === "CRM_DEAL_DETAIL_TAB";
        });
        var isRestPlacement = curPlacement.find(function(current) {
          return current.placement === "REST_APP_URI";
        });
        // BX24.callMethod("placement.unbind", {
        //   "PLACEMENT": "CRM_DEAL_DETAIL_TAB"
        // });
        // BX24.callMethod("placement.unbind", {
        //   "PLACEMENT": "REST_APP_URI"
        // });
        if(!isCrmPlacement) {
          BX24.callMethod(
              "placement.bind",
              {
                "PLACEMENT": "CRM_DEAL_DETAIL_TAB",
                "HANDLER": getFullPathToApp("index.php"),
                "TITLE": "Расценка"
              }
          );
        }
        if(!isRestPlacement) {
          BX24.callMethod(
              "placement.bind",
              {
                "PLACEMENT": "REST_APP_URI",
                "HANDLER": getFullPathToApp("index.php")
              }
          );
        }

        var currentPlacement = getPlacementInfo();

        if(currentPlacement.entity === "task") {
            getTaskID = currentPlacement.entityId;
            ess.root.attr('data-task-id', currentPlacement.entityId);
            getSaveID = currentPlacement.saveId;
            ess.root.attr('data-save-id', currentPlacement.saveId);
        }else if(currentPlacement.entity === "deal") {
            getDealID = currentPlacement.entityId;
            ess.root.attr('data-deal-id', currentPlacement.entityId);
            $('.prc-breadcrumbs').removeClass('hidden');
        }

        // Хлебные крошки
        $.getJSON('data/content.json?'+Date.now(), function(data){
            var len = data.menu.length - 1;
            $.each(data.menu, function(key, val){
                var order = key + 1;
                var phase = $('.js-root').data('phase');
                var a = $('.template .prc-bc a').clone(true)
                a.addClass('js-btn-phase' + order).attr('href', getFullPathToApp(val.link)).text(val.name);
                if(val.hidden) a.addClass('bc-hidden');
                if(order == phase){
                    a.addClass('prc-breadcrumbs__phase--focus');
                }
                a.appendTo('.prc-breadcrumbs');
                if(key !== len){
                    var s = $('.template .prc-bc span').clone(true);
                    if(val.hidden) s.addClass('bc-hidden');
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
        getAppID(jsPage);

        // $('#loader').hide();
      }
  );

});

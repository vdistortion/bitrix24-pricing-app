function jsPage() {
  $(function(){
    $.post(
        "scripts/ajax/getPricingListPhase4.php",
        {
          deal: $('.js-root').data("deal-id")
        },
        getPricingListPhase4
    );
    BX24.callMethod('user.current', {}, function(res){
      $('body').attr('data-current', res.data().ID);
    });
  });

  function superFunction(){
    var obj = {}
    $('table.phase4 tr').each(function(){
      var t = $(this),
          inline = {},
          ib = t.data('iblock');
      if(t.data('id')){
        inline["id"] = t.data('id');
      }
      if(t.data('task')){
        inline["task"] = t.data('task');
      }
      if(t.data('time')){
        inline["time"] = t.data('time');
      }
      if(t.data('message')){
        inline["message"] = t.data('message');
      }
      if(t.data('groupname')){
        inline["groupName"] = t.data('groupname');
      }
      if(t.data('full')){
        inline["full"] = t.data('full');
      }
      if(typeof obj[ib] === "undefined"){
        obj[ib] = [];
      }
      obj[ib].push(inline);
    });
    for (var key in obj) {
      console.log(key);
      console.log(JSON.stringify(obj[key]));
      $.post(
          "scripts/ajax/ajax4.php",
          {
            key: key,
            stringify: JSON.stringify(obj[key])
          },
          onAjaxSuccess4
      );
    }
  }
  function onAjaxSuccess4(data){
    console.log(data);
  }

  function getPricingListPhase4(data){
    $('.phase4').text('');
    var h = $('.template table.header tr').clone(true);
    h.prependTo('.phase4');
    var tt = $('.template table.table-top tr').clone(true);
    tt.prependTo('.phase4');
    JSON.parse(data).forEach(function(item){
      if(item["SERIALIZE"].length){
        console.log(item);
        console.log(ess.root);
        if(item["RATE"]){
          ess.root.attr("data-rate-deal", item["RATE"]);
        };
        var arrayData = JSON.parse(item["SERIALIZE"][item["SERIALIZE"].length - 1]),
            userGet = item["USER"][item["USER"].length - 1],
            id = item["ID"][item["ID"].length - 1];
        console.log(id);
        console.log(arrayData);
        arrayData.forEach(function(item){
          if(typeof item['task'] !== "undefined"){
            var a = $('.template table.e1 tr').clone(true);
            a.find('.js-task input').val(item["task"]);
            a.find('.js-time input').val(item["time"]);

            if(id) a.attr('data-iblock', id);
            if(item["id"]) a.attr('data-id', item["id"]);
            if(item["task"]) a.attr('data-task', item["task"]);
            if(item["time"]) a.attr('data-time', item["time"]);
            if(item["message"]) a.attr('data-message', item["message"]);

            BX24.callMethod('user.get', { ID: userGet }, function(result){
              if(result.data()){
                var user = result.data()[0],
                    href = 'https://'+BX24.getAuth().domain+'/company/personal/user/'+userGet+'/';
                if(!!user){
                  a.find('.js-user').find('.js-dev-link').attr('href', href).text(user.NAME + ' ' + user.LAST_NAME).parent().show();
                  a.find('.js-user').find('.js-dev-select').attr('data-dev-id', userGet).text('Сменить');
                }
              }
            });
            if(item["id"]){
              // Заголовок
              BX24.callMethod(
                  'task.item.getdata',
                  [item["id"]],
                  function(result)
                  {
                    if(result.error()){
                      a.removeAttr('data-id');
                    }else{
                      if(result.data().DEADLINE){
                        var full = new Date(result.data().DEADLINE), date, time;
                        date = full.getFullYear() + "-" + (("0" + (full.getMonth() + 1)).slice(-2)) + "-" + ("0" + full.getDate()).slice(-2);
                        time = ("0" + full.getHours()).slice(-2) + ":" + ("0" + full.getMinutes()).slice(-2);
                        a.find('.js-deadline').attr("data-time", time).val(date);
                      }
                      a.find('.js-idd a').attr('href','https://'+BX24.getAuth().domain+'/company/personal/user/'+userGet+'/tasks/task/view/'+item["id"]+'/').text('Задача');
                      a.find('.js-create-date').text('Обновить');
                    }
                  }
              );
            }
            a.appendTo('.phase4');
          }else{
            var g = $('.template table.group tr').clone(true);
            if(id) g.attr('data-iblock', id);
            if(item["groupName"]) g.attr('data-groupname', item["groupName"]);
            if(item["full"]) g.attr('data-full', item["full"]);
            g.appendTo('.phase4');
          }
        });
      }
    });
    var f = $('.template table.footer tr').clone(true);
    f.appendTo('.phase4');

    BX24.fitWindow();

    $('.js-deadline').datepicker({
      autoClose: true,
      position: "left center",
      dateFormat: 'yyyy-mm-dd',
      minDate: new Date()
    });
    $('.js-deadline.true').datepicker({
      onSelect: function onSelect(formattedDate){
        $('.js-deadline:not(.true)').each(function(){
          if(!$(this).val()){
            $(this).val(formattedDate);
          }
        });
      }
    });
  }

// $('.js-genius').on('click', function(){
//   var obj = {};
//   $('.phase4 tr').each(function(){
//     var then = $(this),
//         task = then.find('.js-task input').val(),
//         user = then.find('.js-dev-link').text(),
//         date = then.find('.js-deadline').val(),
//         str = user + date;
//     if(typeof obj[str] === "undefined"){
//       obj[str] = {
//         "user": user,
//         "date": date,
//         "task": []
//       };
//     }
//     obj[str]["task"].push(task);
//   });
//   console.log(obj);
//   for(key in obj){
//     var user = obj[key]["user"];
//     var date = obj[key]["date"];
//     for(i = 0; i < obj[key]["task"].length; i++){
//       console.log(obj[key]["task"][i]);
//     }
//   }
// });

  $('.js-create-date').on('click', function(){
    var tr = $(this).parents('tr');
    createSuperTask(tr);
  });

  $('.js-create-all').on('click', function(){
    $('.phase4 tr').each(function(){
      var tr = $(this);
      createSuperTask(tr);
    });
  });

  function createSuperTask(tr){
    var message = tr.data('message');
    var task = tr.find('.js-task input').val();
    var user = tr.find('.js-dev-select').data('dev-id');
    var deadline = tr.find('.js-deadline').val();
    var time = tr.find('.js-deadline').data('time') || '19:00';
    if(task && user && deadline){
      var uzhe = tr.data("id");
      var estimate = tr.data("time");
      estimate *= 60 * 60;
      if(uzhe){
        var TaskParams = {
          DEADLINE: deadline.substr(0,10)+'T'+time+':00+03:00',
          CREATED_BY: $('body').data('current'),
          DESCRIPTION: message || '',
          RESPONSIBLE_ID: user,
          TIME_ESTIMATE: estimate || 900
        };

        if (isTeamPortal()) {
          TaskParams.UF_PRICE_HOUR = ess.root.data("rate-deal") || constant.RATE;
        }

        BX24.callMethod(
            'task.item.update',
            [uzhe, TaskParams],
            function(result)
            {
              console.info(result.data());
              console.log(result);
            }
        );
      }else{
        BX24.callMethod(
            'task.item.add',
            [{TITLE: task,
              DESCRIPTION: message || '',
              UF_PRICE_HOUR: ess.root.data("rate-deal") || constant.RATE, // ставка часа, пользовательское
              ALLOW_TIME_TRACKING: "Y",
              TIME_ESTIMATE: estimate || 900, // плановое время 15 минут (60*60/4)
              TASK_CONTROL: 'Y', // задача закрывается на контроль
              CREATED_BY: $('body').data('current'),
              RESPONSIBLE_ID: user,
              DEADLINE: deadline.substr(0,10)+'T'+time+':00+03:00',
              UF_CRM_TASK: ["D_"+getDealID]}],
            function(result){
              console.log(result);
              var rar = result.answer.result;
              tr.attr('data-id', result.answer.result);
              tr.find('.js-create-date').text('Обновить');
              // Заголовок
              BX24.callMethod(
                  'task.item.getdata',
                  [rar],
                  function(result)
                  {
                    tr.find('.js-idd a').attr('href','https://'+BX24.getAuth().domain+'/company/personal/user/'+user+'/tasks/task/view/'+rar+'/').text("Задача");
                  }
              );
              superFunction();
            }
        );
      }
    }
  }
}

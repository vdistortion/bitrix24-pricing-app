BX24.callMethod(
  "crm.deal.get", 
  { id: ess.root.data('deal-id') }, 
  function(result) 
  {
    if(result.error()){
      console.error(result.error());
    }
    else{
      console.dir(result.data());
      console.dir(result.data().TITLE);
      var href = 'https://'+BX24.getAuth().domain+'/crm/deal/details/'+result.data().ID+'/';
      var text = result.data().TITLE;
      $('.js-deal-link').attr('href', href).text(text);
    }
  }
);


$.post(
  "scripts/ajax/getPricingListAJAX.php",
  {
    deal: $('.js-root').data("deal-id")
  },
  getPricingList
);

$('.js-table tbody').on("sortupdate", function(){
  countGroup();
  calcPricingList('.js-plan', '.js-total-plan');
  calcPricingList('.js-kp', '.js-total-kp');
});

$('.js-wonder-button').on('click', function(){
  var el = $(this).parents('.js-table');
  if(!$(this).prop('checked')){
    el.removeClass('enabled');
    el.addClass('disable');
    $('.js-total-time,.js-total-plan,.js-total-kp').val('?');
    calcPricingList('.js-plan', '.js-total-plan');
    calcPricingList('.js-kp', '.js-total-kp');
  }else{
    el.removeClass('disable');
    el.addClass('enabled');
    $('.js-total-time,.js-total-plan,.js-total-kp').val('?');
    calcPricingList('.js-plan', '.js-total-plan');
    calcPricingList('.js-kp', '.js-total-kp');
  }
});

$('.js-rate').on('input', function(){
  calcPricingList('.js-plan', '.js-total-plan');
  calcPricingList('.js-kp', '.js-total-kp');
});

$('.js-kp').on('input', function(){
  var summ = 0;
  let kpval = +$(this).val();
  let rateval = +$(".js-rate").val();c3
  $(this).parent().parent().find(".js-kpt").val(kpval / rateval);

  $('table.enabled .js-line .js-kp').each(function(){
    summ += +$(this).val();
    $('.js-total-kp').val(summ);
  });
  calcPricingList('.js-plan', '.js-total-plan');
  countGroup();
  $('#naz').val(+$('.js-total-kp').val() - +$('.js-total-plan').val());
});

$('.js-kpt').on('input', function () {
  let num = Number($(this).val());
  $(this).parent().parent().find('.js-kp').val(Number($('.js-rate').val()) * num);
  var summ = 0;
  $('table.enabled .js-line .js-kp').each(function(){
    summ += +$(this).val();
    $('.js-total-kp').val(summ);
  });
  calcPricingList('.js-plan', '.js-total-plan');
  countGroup();
  $('#naz').val(+$('.js-total-kp').val() - +$('.js-total-plan').val());

});

$('.saveKP').on('click', function(){
  console.log(ess.root.data("deal-id"));
  console.log($(".js-rate").val());
  $.ajax({
    type: "POST",
    url: "route.php",
    data: {
      file: 'setRate.php',
      prepack: JSON.stringify({
        iblock: 69,
        deal: ess.root.data("deal-id"),
        rate: $(".js-rate").val()
      })
    },
    success: function(msg){
      var obj = JSON.parse(msg);
      // console.log(msg);
      // console.log(obj);
      if(obj["ERROR"]){
        console.log(obj["ERROR"]);
      }else{
        for (key in obj) {
          console.log(obj[key]);
        }
      }
    }
  });
  var $this = $(this);
  var rate, productrows, total, deal, task, time, message, obj;
  rate = $('.js-rate').val(); productrows = [];
  total = $('.js-total-kp').val();
  deal = $('.js-root').data('deal-id');
  address = 'https://'+BX24.getAuth().domain+'/marketplace/app/'+ess.root.attr('data-app-id')+'/?phase=3&deal='+deal;
  bbcode = '[url='+address+']Ссылка на КП[/url]';
  var string = '\n[table][tr][th]Ставка, руб.[/th][th]Наценка, руб.[/th][th]Всего, руб.[/th][th]Ссылка на КП[/th][/tr][tr][td]'+rate+'[/td][td]'+$('#naz').val()+'[/td][td]'+total+'[/td][td]'+bbcode+'[/td][/tr][/table]\n\n[table][tr][th]Работа[/th][th]План, часы[/th][th]План, руб.[/th][th]Сумма КП, руб.[/th][/tr]';
  $('table.enabled tbody .js-line').each(function(){
    obj = {};
    kp = $(this).find('.js-kp').val();
    kpt = $(this).find('.js-kpt').val();
    time = $(this).find('.js-time').val();
    task = $(this).find('.js-task').val();
    plan = $(this).find('.js-plan').val();
    message = $(this).find('.js-message').attr("title");
    obj["PRICE"] = kp;
    obj["PRICE_TIME"] = kpt;
    obj["PRODUCT_NAME"] = task;
    obj["MEASURE_CODE"] = 796; // Штуки
    if (message) obj["PRODUCT_DESCRIPTION"] = message;
    productrows[productrows.length] = obj;
    string += '[tr][td]'+task+'[/td][td]'+time+'[/td][td]'+plan+'[/td][td]'+kp+'[/td][/tr]';
  });
  string += '[/table]';

  BX24.callMethod(
    "crm.deal.productrows.set", 
    {
      id: ess.root.attr('data-deal-id'),
      rows: productrows
    },
    function(result){
      if(result.error())
        console.error(result.error());
      else
        $this.find('.js-doneKP').text('Готово');
    }
  );
  BX24.callMethod(
    "crm.deal.update",
    {
      id: ess.root.attr('data-deal-id'),
      fields:
      {
        "UF_CRM_1429253094": address, // Расценка
        "UF_CRM_1486362975": $('#naz').val() // Наценка
      },
      params: { "REGISTER_SONET_EVENT": "Y" }
    },
    function(result) 
    {
      if(result.error())
        console.error(result.error());
      else
      {
        console.info(result.data());            
      }
    }
  );

  BX24.callMethod(
     "crm.livefeedmessage.add",
     {
        fields:
        {
         "POST_TITLE": "КП",
         "MESSAGE": string,
         "SPERM": {},
         "ENTITYTYPEID": 2,
         "ENTITYID": ess.root.attr('data-deal-id')
        }
     },
     function(result)
     {
        if(result.error())
           console.error(result.error());
        else
           console.info("Создано сообщение с ID " + result.data());
     }
  );
});

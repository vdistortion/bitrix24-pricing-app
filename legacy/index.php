<script>
  // Получаем GET
  function getParam(getParam){
    var referrer = document.referrer;
    console.log(referrer);
    if(referrer.indexOf('?') + 1){
      var refGet = referrer.split('?')[1];
      var url = refGet.split('&').reduce(
        function(p,e){
          var a = e.split('=');
          p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
          return p;
        },
        {}
      );
      return url[getParam];
    }
  }

  console.log(<?=json_encode($_SERVER)?>);

  debugger;

  switch(getParam('phase')){
    case '2':
      document.location.href = "phase2.php?phase="+getParam('phase')+"&deal="+getParam('deal')+"&task="+getParam('task')+"&user="+getParam('user')+"&save="+getParam('save');
      break;
    case '3':
      document.location.href = "phase3.php?phase="+getParam('phase')+"&deal="+getParam('deal');
      break;
    case '4':
      document.location.href = "phase4.php?phase="+getParam('phase')+"&deal="+getParam('deal');
      break;
    default:
      //document.location.href = "phase1.php?phase="+getParam('phase')+"&deal="+getParam('deal');
		let page = prompt('какой адрес в браузере?', '');
      if(page) {
		  document.location.href = "phase2.php" + page;
	  } else {
		  document.location.href = "phase1.php?phase="+getParam('phase')+"&deal="+getParam('deal');
      }
  }
</script>

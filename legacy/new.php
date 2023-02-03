<!DOCTYPE html>
<html lang="ru-RU">
  <head>
    <title>Document</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width">
    <style></style>
  </head>
  <body>
    <button class="arResult">arResult</button>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script>
      $(function(){
        $('.arResult').on('click', function(){
          $.ajax({
            type: "POST",
            url: "route.php",
            data: {
              file: 'demo.php',
              prepack: JSON.stringify({
                iblock: "priceSave",
                filter: {
                  deal: 12853,
                  task: 22009,
                  user: 648
                }
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
        });
      });
    </script>
  </body>
</html>

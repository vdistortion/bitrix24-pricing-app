<?php

$save = $_POST["str"]; // JSON.stringify

$new = '[{"task":"значение 1","time":"6","message":""},{"task":"значение 2","time":"7","message":"нет описания"},{"task":"значение 3","time":"2","message":""},{"task":"значение 4","time":"8","message":"описание 2"},{"task":"значение 5","time":"7","message":"нет описания"},{"task":"значение 6","time":"5","message":"описание 1"}]';



if(isset($_POST['str']) && isset($_POST['task']) && isset($_POST['user']) && isset($_POST['class']) && isset($_POST['name'])){
  $clientData = [
    'str' => $_POST['str'],
    'task' => $_POST['task'],
    'user' => $_POST['user'],
    'class' => $_POST['class'],
    'name' => $_POST['name']
  ];
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'http://sozdavatel.szdl.ru/.ajax/pricing/t.php');
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $clientData);
  $output = curl_exec($ch);
  curl_close($ch);

  echo $output;
}

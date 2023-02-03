<?php

$save = $_POST["class"];

if(isset($_POST['class']) && isset($_POST['name'])){
  $clientData = [
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

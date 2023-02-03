<?php

if(isset($_POST['dealId']) && isset($_POST['taskId']) && isset($_POST['taskName']) && isset($_POST['dealName'])){
  $clientData = [
    'dealName' => $_POST['dealName'],
    'taskName' => $_POST['taskName'],
    'dealId' => $_POST['dealId'],
    'taskId' => $_POST['taskId']
  ];
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'http://sozdavatel.szdl.ru/.ajax/pricing/ajax.php');
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $clientData);
  $output = curl_exec($ch);
  curl_close($ch);

  echo $output;
}

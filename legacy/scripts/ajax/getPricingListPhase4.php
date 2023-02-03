<?php

if(isset($_POST['deal'])){
  $clientData = [
    'deal' => $_POST['deal']
  ];
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'http://sozdavatel.szdl.ru/.ajax/pricing/phase4.php');
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $clientData);
  $output = curl_exec($ch);
  curl_close($ch);

  echo $output;
}

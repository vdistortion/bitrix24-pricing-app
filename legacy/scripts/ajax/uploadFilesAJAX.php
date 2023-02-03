<?php

$address = $_POST['domain'];
$auth = $_POST['token'];
$id = $_POST['id'];

if($address && $auth && $id){
  if(isset($_FILES['files']) && !empty($_FILES['files'])){
    if($_FILES["files"]["error"] > 0){
      echo "Ошибка: " . $_FILES["files"]["error"] . "<br>";
    }else{
      $dir = '../tmp/';
      if(!is_dir($dir)){
        mkdir('./' . $dir, 0777);
      };
      $path = $dir . $_FILES["files"]["name"];
      if(file_exists($path)){
        unlink(realpath($path));
      }
      move_uploaded_file($_FILES["files"]["tmp_name"], $path);
      echo 'Файл загружен: ' . realpath($path);

      $curl = curl_init();
      curl_setopt($curl, CURLOPT_URL, 'https://'.$address.'/rest/task.item.addfile.xml');
      curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($curl, CURLOPT_POST, true);
      curl_setopt($curl, CURLOPT_POSTFIELDS, array(
        'auth' => $auth,
        'TASK_ID' => $id,
        'FILE[NAME]' => $_FILES["files"]["name"],
        'FILE[CONTENT]' => base64_encode(file_get_contents(realpath($path)))
      ));
      $out = curl_exec($curl);
      print_r($out);
      curl_close($curl);

      unlink(realpath($path));
      echo 'Файл удалён: ' . realpath($path);
    }
  }else{
    echo 'Выберите файл';
  }
}

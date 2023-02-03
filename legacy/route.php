<?php

// ini_set("display_errors",1);
// error_reporting(E_ALL);

// $iBlocks = Array(
//   "Задачи на расценку" => Array(
//     "IBLOCK_ID" => 67,
//     "CODE" => "pricingTasks",
//     "NAME" => "Название расценки",
//     "PROPERTY_*" => Array(
//       "idTask" => "Задача",
//       "idDeal" => "Сделка"
//     )
//   ),
//   "Сделки" => Array(
//     "IBLOCK_ID" => 69,
//     "CODE" => "pricingDeal",
//     "NAME" => "Название сделки",
//     "PROPERTY_*" => Array(
      // "idDeal" => "Сделка",
      // "RATE" => "Ставка часа"
//     )
//   ),
//   "Задачи в работу" => Array(
//     "IBLOCK_ID" => 70,
//     "CODE" => "jobTasks"
//   ),
//   "Сохранёнки" => Array(
//     "IBLOCK_ID" => 71,
//     "CODE" => "priceSave",
//     "NAME" => "Дата и время",
//     "PROPERTY_*" => Array(
//       "SERIALIZE" => "Строка",
//       "TASK" => "Задача",
//       "USER" => "Пользователь",
//       "CLASS" => "Класс"
//     )
//   )
// );

if(isset($_POST["file"]))
{
  $data = Array(
    "data" => json_encode(json_decode($_POST["prepack"], true))
  );
  $path = "http://sozdavatel.szdl.ru/.ajax/pricing/";
  $file = $_POST["file"];
  $handler = $path . $file;
  echo curl_db($handler, $data);
}
else
{
  echo json_encode(Array("ERROR"=>"Не указан файл-обработчик"));
}

function curl_db($handler, $data)
{
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $handler);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  $output = curl_exec($ch);
  curl_close($ch);
  return $output;
}

<?php

define('APP_NAME', 'Проект "Создаватель"');

?>

<!DOCTYPE html>
<html lang="ru-RU">
  <head>
    <title><?=APP_NAME?>. <?=PHASE_TITLE?></title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="vendor/normalize.min.css">
    <link rel="stylesheet" href="vendor/datepicker.min.css">
    <link rel="stylesheet" href="vendor/jquery-ui.min.css">
    <link rel="stylesheet" href="css/loader.css?v=<?= rand(); ?>">
    <link rel="stylesheet" href="css/styles.css?v=<?= rand(); ?>">
    <link rel="stylesheet" href="css/new.css?v=<?= rand(); ?>">
  </head>
  <body class="js-root"<?php
                          if($_GET['phase'] && $_GET['phase'] != 'undefined') echo ' data-phase="'.$_GET['phase'].'"';
                          if($_GET['view'] && $_GET['view'] != 'undefined') echo ' data-view="'.$_GET['view'].'"';
                          if($_GET['deal'] && $_GET['deal'] != 'undefined') echo ' data-deal-id="'.$_GET['deal'].'"';
                          if($_GET['task'] && $_GET['task'] != 'undefined') echo ' data-task-id="'.$_GET['task'].'"';
                          if($_GET['user'] && $_GET['user'] != 'undefined') echo ' data-user-id="'.$_GET['user'].'"';
                          if($_GET['save'] && $_GET['save'] != 'undefined') echo ' data-save-id="'.$_GET['save'].'"';
                        ?>>

    <!-- Хлебные крошки -->
    <div class="prc-breadcrumbs"></div>
    <div class="template" hidden>
      <div class="prc-bc">
        <a class="prc-breadcrumbs__phase"></a>
        <span class="prc-breadcrumbs__separator"></span>
      </div>
    </div>

    <!-- Вывод ошибок -->
    <div class="prc-errors">
      <div class="prc-errors__info js-errors"></div>
    </div>

<!DOCTYPE html>
<html lang="ru-RU">
  <head>
    <title>Расценки</title>
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
  <body class="js-root">

    <!-- Хлебные крошки -->
    <div class="prc-breadcrumbs hidden"></div>
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

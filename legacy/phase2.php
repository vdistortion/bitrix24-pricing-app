<?php

define('PHASE_TITLE', 'Шаг 2: Расценка проекта');

require_once "inc/header.inc.php";

?>

<!-- Название задачи -->
<div class="task-title">
  <a class="task-title__input tasktitle js-get-tasktitle" href="#" target="_blank">Название задачи</a>
</div>

<!-- Описание -->
<div class="task-info-editor">
  <div class="feed-add-post">
    <div class="feed-add-post-form">
      <div class="feed-add-post-text">
        <div class="bxhtmled-textarea js-get-description">Описание задачи</div>
      </div>
    </div>
  </div>
</div>

<!-- Расценки -->
<table class="phase2table js-table">
  <thead>
    <tr>
      <th></th>
      <th>Работа</th>
      <th>Время</th>
      <th>Комментарий</th>
      <th></th>
    </tr>
  </thead>
    <tfoot>
        <tr>
            <td></td>
            <td style="text-align: right;">Часов, итого:</td>
            <td class="js-time-all"></td>
            <td></td>
        </tr>
    </tfoot>
  <tbody>
    <tr class="js-line">
      <td class="sortable">
        <div class="divi"></div>
      </td>
      <td>
        <input class="tdfull js-task">
      </td>
      <td>
        <div class="counter">
          <button class="counter__control" data-action="minus">-</button>
          <input class="counter__input time js-time" value="1">
          <button class="counter__control" data-action="plus">+</button>
        </div>
      </td>
      <td>
        <input class="tdfull js-message">
      </td>
      <td>
        <div class="webform-small-button-separate-wrap1 delete-line">
          <button class="webform-small-button1 webform-small-button-blue1 js-delete-line">Удалить</button>
        </div>
      </td>
    </tr>
  </tbody>
</table>

<!-- Сохранёнки -->
<div class="task-options-item">
  <div class="webform-small-button-separate-wrap1 js-create">
    <button class="webform-small-button1 webform-small-button-blue1">Добавить строку</button>
  </div>
  <div class="task-options-item-open-inner">
    <div class="task-form-field js-saved-list" style="max-width: 665px">
      <!--  -->
      <span class="task-form-field-controls">
        <span class="task-form-field-link js-save">Сохранить</span>
      </span>
    </div>
  </div>
</div>
<div class="task-options-item">
  <div class="webform-small-button-separate-wrap1 js-group">
    <button class="webform-small-button1 webform-small-button-blue1">Добавить группу</button>
  </div>
</div>

<!-- Кнопка -->
<div class="tasks-form-footer-container">
  <button class="webform-small-button webform-small-button-accept js-done" style="margin-left: 20px;">
    <span class="webform-small-button-text">Закрыть задачу</span>
  </button>
</div>


<div class="template" hidden>
  <!-- Шаблон строки -->
  <table class="template__new-line">
    <tr class="js-line">
      <td class="sortable">
        <div class="divi"></div>
      </td>
      <td>
        <input class="tdfull js-task">
      </td>
      <td>
        <div class="counter">
          <button class="counter__control" data-action="minus">-</button>
          <input class="counter__input time js-time" value="1">
          <button class="counter__control" data-action="plus">+</button>
        </div>
      </td>
      <td>
        <input class="tdfull js-message">
      </td>
      <td>
        <div class="webform-small-button-separate-wrap1 delete-line">
          <button class="webform-small-button1 webform-small-button-blue1 js-delete-line">Удалить</button>
        </div>
      </td>
    </tr>
  </table>
  <!-- Шаблон группы -->
  <table class="template__new-group">
    <tr class="js-group-tr">
      <td class="sortable">
        <div class="divi"></div>
      </td>
      <td colspan="3">
        <input class="js-group-name" style="width: 409px;font-weight: bold;">
        <input class="prc-input counter__input time js-full" readonly style="font-weight: bold;">
      </td>
      <td>
        <div class="webform-small-button-separate-wrap1 delete-line">
          <button class="webform-small-button1 webform-small-button-blue1 js-delete-line">Удалить</button>
        </div>
      </td>
    </tr>
  </table>
  <!-- Шаблон сохранёнки -->
  <div class="template__new-button">
    <span class="task-form-field-item js-price-item">
      <span role="button"></span>
      <span class="task-form-field-item-delete js-deletelement" title="Отменить выбор"></span>
    </span>
  </div>
</div>

    <?php require_once "inc/scripts.inc.php"; ?>
    <script src="js/phase2.js?v=<?= rand(); ?>"></script>
  </body>
</html>

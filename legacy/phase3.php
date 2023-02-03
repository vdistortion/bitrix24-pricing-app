<?php

define('PHASE_TITLE', 'Шаг 3: Генерация КП');

require_once "inc/header.inc.php";

?>

<div class="phase3">
  <header class="prc-header">
    <label>
      <b>Ставка, руб.</b>
      <input class="prc-input prc-input__rate js-rate" autofocus>
    </label>
  </header>
  <div class="table-list"></div>
  <footer class="prc-footer">
    <table class="prc-footer__table" border="1">
      <thead>
        <tr class="js-line">
          <td colspan="2">
            <input class="prc-input text prc-itogo-total js-itogo" readonly>
          </td>
          <td>
            <input class="prc-input prc-input__number js-total-time" readonly>
          </td>
          <td>
            <input class="prc-input prc-input__number total js-total-plan" readonly>
          </td>
          <td>
            <input class="prc-input prc-input__number total js-total-kpt" readonly>
          </td>
          <td>
            <input class="prc-input prc-input__number total js-total-kp" readonly>
          </td>
        </tr>
      </thead>
    </table>
    <div class="flex">
      <div>
        <b>Наценка, руб.</b>
        <input class="prc-input prc-input__rate" id='naz' readonly>
      </div>
    </div>
    <div class="flex" style="margin: 10px 3px 0 0;">
      <label style="margin-right: 20px">
        <a class="webform-button-link js-deal-link" target="_blank" title="Перейти"></a>
      </label>
      <button class="webform-small-button webform-small-button-accept saveKP" style="margin: 0;">
        <span class="webform-small-button-text js-doneKP">Сохранить КП</span>
      </button>
    </div>
  </footer>
</div>

<div class="template" hidden>
  <!-- Общий шаблон -->
  <div class="prc-welldone">
    <table class="prc-welldone__table enabled js-table" border="1">
      <thead>
        <tr>
          <th colspan="2">
            <div class="prc-welldone__title">
              <input class="prc-input prc-welldone__toggle js-wonder-button" type="checkbox" checked="checked">
              <div class="prc-welldone__detail">
                <a class="prc-welldone__task js-title" href="#" target="_blank"></a>
                <!-- [<a class="prc-welldone__user js-name" href="#"></a>] -->
              </div>
            </div>
          </th>
          <th class="no-event">План, часы</th>
          <th class="no-event">План, руб.</th>
          <th class="no-event">КП, часы</th>
          <th class="no-event">Сумма КП, руб.</th>
        </tr>
      </thead>
      <tbody class="js-pricing"></tbody>
    </table>
  </div>
  <!-- Задача -->
  <table class="table">
    <tr class="js-line">
      <td class="sortable">
        <div class="divi"></div>
      </td>
      <td class="js-message">
        <input class="prc-input text js-task">
      </td>
      <td>
        <input class="prc-input prc-input__number js-time" readonly>
      </td>
      <td>
        <input class="prc-input prc-input__number total js-plan" readonly>
      </td>
      <td>
        <input class="prc-input prc-input__number total js-kpt">
      </td>
      <td>
        <input class="prc-input prc-input__number total js-kp">
      </td>
    </tr>
  </table>
  <!-- Группа -->
  <table class="table">
    <tr class="js-group-tr">
      <td class="sortable">
        <div class="divi"></div>
      </td>
      <td class="js-message">
        <input class="prc-input text js-group-name" style="font-weight: bold;">
      </td>
      <td>
        <input class="prc-input prc-input__number js-time js-full" readonly style="font-weight: bold;">
      </td>
      <td>
        <input class="prc-input prc-input__number total js-plan" readonly style="font-weight: bold;">
      </td>
      <td>
        <input class="prc-input prc-input__number total js-kpt" readonly style="font-weight: bold;">
      </td>
      <td>
        <input class="prc-input prc-input__number total js-kp" readonly style="font-weight: bold;">
      </td>
    </tr>
  </table>
</div>

    <?php require_once "inc/scripts.inc.php"; ?>
    <script src="js/phase3.js?v=<?= rand(); ?>"></script>
  </body>
</html>

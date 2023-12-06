<?php

require_once "inc/header.inc.php";

?>

  <!-- <button class="bx-btn bx-btn__blue js-genius">Секретная кнопка</button> -->

  <table class="phase4">
    <tr>
      <td>
        <div id="loader" class="vertical--center">
          <div class="vertical-center__element">
            <span class="preloader preloader--top"></span>
            <span class="preloader preloader--bottom"></span>
          </div>
        </div>
      </td>
    </tr>
  </table>

  <table class="phase42"></table>

  <div class="template" hidden>
    <table class="e1">
      <tr class="line">
        <td class="js-task" style="max-width: 300px;"><input class="prc-input prc-input__number total" style="width: 90%;text-align: left;"></td>
        <td class="js-user" style="font-size: 0;">
          <div class="task-options-item" style="margin: 0 10px; padding: 0;">
            <div class="task-options-item-open-inner">
              <div class="task-form-field">
                <span class="task-form-field-item" style="display: none;">
                  <a class="task-form-field-item-text js-dev-link" href="#" target="_blank"></a>
                  <span class="task-form-field-item-delete js-dev-del" title="Отменить выбор"></span>
                </span>
                <span class="task-form-field-controls">
                  <span class="task-form-field-link js-dev-select">Выбрать</span>
                </span>
              </div>
            </div>
          </div>
        </td>
        <td class="js-time"><input class="prc-input prc-input__number total" style="max-width: 50px;" readonly></td>
        <td class="js-date" style="font-size: 0;">
          <span class="deadline">
            <span class="deadline__container">
              <input class="deadline__input js-deadline" readonly placeholder="Нет крайнего срока">
            </span>
          </span>
        </td>
        <td style="max-width: 120px;">
          <button class="bx-btn bx-btn__blue js-create-date">Создать</button>
        </td>
        <td class="js-idd"><a class="webform-button-link" href="#" target="_blank"></a></td>
      </tr>
    </table>
    <table class="e2">
      <tr>
        <td class="js-taskName"></td>
        <td class="js-taskDev"></td>
        <td class="js-taskDate"></td>
        <td class="js-taskList"></td>
      </tr>
    </table>
    <table class="table-top">
      <tr class="table-top">
        <td></td>
        <td></td>
        <td></td>
        <td>
          <span class="deadline">
            <span class="deadline__container">
              <input class="deadline__input js-deadline true" readonly placeholder="Заполнить пустые">
            </span>
          </span>
        </td>
        <td></td>
        <td></td>
      </tr>
    </table>
    <table class="header">
      <tr class="header">
        <th>Работа</th>
        <th>Ответственный</th>
        <th>Часы</th>
        <th>Крайний срок</th>
        <th></th>
        <th></th>
      </tr>
    </table>
    <table class="footer">
      <tr class="footer">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td style="max-width: 120px;"><button class="bx-btn bx-btn__green js-create-all">Создать задачи</button></td>
        <td></td>
      </tr>
    </table>
    <table class="group">
      <tr class="group"></tr>
    </table>
  </div>

    <?php require_once "inc/scripts.inc.php"; ?>
    <script src="js/phase4.js?v=<?= rand(); ?>"></script>
  </body>
</html>

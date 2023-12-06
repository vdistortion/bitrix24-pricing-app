<?php

require_once "inc/header.inc.php";

?>

<div class="task-options">

  <!-- Сделка -->
  <div class="task-options-item">
    <span class="task-options-item-param">Сделка</span>
    <div class="task-options-item-open-inner">
      <div class="task-form-field">
        <span class="task-form-field-item" style="display: none;">
          <a class="task-form-field-item-text js-deal-link" href="#" target="_blank"></a>
          <span class="task-form-field-item-delete js-deal-del" title="Отменить выбор"></span>
        </span>
        <span class="task-form-field-controls">
          <span class="task-form-field-link js-deal-select">Выбрать</span>
        </span>
      </div>
    </div>
  </div>

  <!-- Постановщик -->
  <div class="task-options-item">
    <span class="task-options-item-param">Постановщик</span>
    <div class="task-options-item-open-inner">
      <div class="task-form-field">
        <span class="task-form-field-item" style="display: none;">
          <a class="task-form-field-item-text js-manager-link" href="#" target="_blank"></a>
          <span class="task-form-field-item-delete js-manager-del" title="Отменить выбор"></span>
        </span>
        <span class="task-form-field-controls">
          <span class="task-form-field-link js-manager-select">Выбрать</span>
        </span>
      </div>
    </div>
  </div>

  <!-- Ответственный -->
  <div class="task-options-item">
    <span class="task-options-item-param">Ответственный</span>
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

  <!-- Дедлайн -->
  <div class="task-options-item">
    <span class="task-options-item-param">Крайний срок</span>
    <div class="task-options-item-more">
      <span class="task-options-destination-wrap">
        <span class="task-options-inp-container">
          <input class="task-options-inp js-deadline" readonly placeholder="Нет крайнего срока">
        </span>
      </span>
    </div>
  </div>

</div>

<!-- Название задачи -->
<div class="task-title">
  <input class="task-title__input js-title" placeholder="CRM: РАСЦЕНКА - " autofocus>
</div>

<!-- Описание -->
<div class="task-info-editor">
  <div class="feed-add-post">
    <div class="feed-add-post-form">

      <div class="feed-add-post-text">
        <div class="bx-html-editor">
          <div class="bxhtmled-area-cnt">
            <div class="bxhtmled-iframe-cnt">
              <iframe class="bx-editor-iframe"></iframe>
            </div>
            <div class="bxhtmled-textarea-cnt">
              <textarea cols="30" rows="10" class="bxhtmled-textarea js-description"></textarea>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<!-- Добавление файлов -->
<div class="diskuf-extended">
  <table class="wd-fa-add-file-light-table">
    <tbody>
      <tr>
        <td class="diskuf-selector">
          <div class="diskuf-uploader">
            <span class="wd-fa-add-file-light">
              <span class="wd-fa-add-file-light-text">
                <span class="wd-fa-add-file-light-title">
                  <span>Загрузить файл или картинку</span>
                </span>
                <span class="wd-fa-add-file-light-descript">Перетащить с помощью Drag'n'drop</span>
              </span>
            </span>
            <div class="diskuf-fileUploader js-upload-files"></div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<div class="tasks-form-footer-container">

  <!-- Кнопка -->
  <button class="webform-small-button webform-small-button-accept js-task-create">
    <span class="webform-small-button-text">Поставить задачу</span>
  </button>

  <!-- Ссылка на поставленную задачу -->
  <a class="webform-button-link js-task-link" target="_blank" title="Перейти"></a>

</div>
<div>
    <ul class="js-title-error"></ul>
</div>


    <?php require_once "inc/scripts.inc.php"; ?>
    <script src="js/phase1.js?v=<?= rand(); ?>"></script>
  </body>
</html>


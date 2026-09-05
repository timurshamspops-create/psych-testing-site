/**
 * Как это работает
 * -----------------
 * 1. Каждый опрос (Google Form) отправляет ответы не в свою собственную
 *    таблицу, а в общую таблицу-результат — на отдельный лист (вкладку),
 *    названный так же, как "id" опроса в data/surveys.json
 *    (например: big5, gad7, eq).
 *    В Google Forms: Ответы → значок таблицы → "Выбрать место назначения
 *    ответов" → существующая таблица → выбрать общую таблицу.
 *
 * 2. Этот скрипт привязывается к общей таблице (Расширения → Apps Script),
 *    подсчитывает количество ответов (строк без заголовка) на каждом листе
 *    и отдаёт результат в формате JSON через doGet.
 *
 * 3. Разворачивается как веб-приложение:
 *    Deploy → New deployment → Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Скопируйте полученный URL и вставьте его в js/results.js
 *    как значение APPS_SCRIPT_URL.
 */

function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();

  var counts = sheets.map(function (sheet) {
    var rows = sheet.getLastRow();
    var responseCount = Math.max(rows - 1, 0); // минус строка заголовка
    return {
      id: sheet.getName(),
      count: responseCount
    };
  });

  return ContentService
    .createTextOutput(JSON.stringify(counts))
    .setMimeType(ContentService.MimeType.JSON);
}

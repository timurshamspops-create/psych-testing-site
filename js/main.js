// Загружает список опросов из data/surveys.json.
// Используется главной страницей (рендер карточек), а также
// survey.js и results.js — чтобы не дублировать fetch-логику.
function fetchSurveys() {
  return fetch("data/surveys.json").then(function (res) {
    if (!res.ok) throw new Error("Не удалось загрузить список опросов");
    return res.json();
  });
}

// Рендер карточек опросов на главной странице.
// Если элемент #survey-list отсутствует на странице — просто ничего не делаем.
(function renderSurveyList() {
  var listEl = document.getElementById("survey-list");
  if (!listEl) return;

  fetchSurveys()
    .then(function (surveys) {
      listEl.innerHTML = surveys.map(surveyCardHTML).join("");
    })
    .catch(function (err) {
      listEl.innerHTML =
        '<p class="lede">Не получилось загрузить список опросов. Проверьте, что файл data/surveys.json доступен.</p>';
      console.error(err);
    });
})();

function surveyCardHTML(survey) {
  return (
    '<article class="survey-card">' +
    '<span class="tag">' + escapeHTML(survey.category) + "</span>" +
    "<h2>" + escapeHTML(survey.title) + "</h2>" +
    "<p>" + escapeHTML(survey.description) + "</p>" +
    '<div class="meta">' + escapeHTML(survey.duration) + "</div>" +
    '<a class="btn" href="survey.html?id=' + encodeURIComponent(survey.id) + '">Пройти опрос</a>' +
    "</article>"
  );
}

function escapeHTML(str) {
  var div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

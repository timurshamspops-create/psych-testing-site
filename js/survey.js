(function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");

  var titleEl = document.getElementById("survey-title");
  var metaEl = document.getElementById("survey-meta");
  var descEl = document.getElementById("survey-description");
  var embedWrap = document.getElementById("survey-embed-wrap");
  var embed = document.getElementById("survey-embed");

  if (!id) {
    titleEl.textContent = "Опрос не выбран";
    descEl.textContent = "Вернитесь к списку и выберите один из опросов.";
    return;
  }

  fetchSurveys()
    .then(function (surveys) {
      var survey = surveys.filter(function (s) { return s.id === id; })[0];

      if (!survey) {
        titleEl.textContent = "Опрос не найден";
        descEl.textContent = "Такого опроса нет в списке — возможно, ссылка устарела.";
        return;
      }

      titleEl.textContent = survey.title;
      metaEl.textContent = survey.category + " · " + survey.duration;
      descEl.textContent = survey.description;

      embed.src = toEmbedUrl(survey.formUrl);
      embedWrap.style.display = "";
    })
    .catch(function (err) {
      titleEl.textContent = "Ошибка загрузки";
      descEl.textContent = "Не получилось загрузить данные опроса.";
      console.error(err);
    });

  // Google Forms нужно открывать с параметром embedded=true, чтобы форма
  // отображалась без своей шапки/футера — это работает и если в surveys.json
  // сохранена обычная ссылка на форму (viewform без параметров).
  function toEmbedUrl(url) {
    if (url.indexOf("embedded=true") !== -1) return url;
    return url + (url.indexOf("?") !== -1 ? "&" : "?") + "embedded=true";
  }
})();

// Вставьте сюда адрес вашего Apps Script веб-приложения (см. apps-script/Code.gs
// и README.md), чтобы результаты стали настоящими, а не демонстрационными.
// Пример: "https://script.google.com/macros/s/AKfycb.../exec"
var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvWIwSC4M-ktUi8679SsWFYMvm0CtLy3Nr5rWcv1xmQ2rlR-L9Pjm2BZ-jMt061cWk/exec";

var DEMO_COUNTS = [
  { id: "big5", count: 34 },
  { id: "gad7", count: 58 },
  { id: "eq", count: 21 }
];

var PALETTE = ["#b97a2b", "#4b7a72", "#6b6e66"];

Promise.all([fetchSurveys(), fetchCounts()]).then(function (results) {
  var surveys = results[0];
  var counts = results[1].data;
  var isDemo = results[1].isDemo;

  var notice = document.getElementById("data-notice");
  if (isDemo) {
    notice.style.display = "";
    notice.textContent =
      "Показаны демонстрационные данные. Чтобы подключить реальную статистику, " +
      "укажите адрес Apps Script в js/results.js (см. APPS_SCRIPT_URL).";
  }

  var byId = {};
  counts.forEach(function (c) { byId[c.id] = c.count; });

  var labels = surveys.map(function (s) { return s.title; });
  var values = surveys.map(function (s) { return byId[s.id] || 0; });
  var total = values.reduce(function (a, b) { return a + b; }, 0);
  var topIndex = values.indexOf(Math.max.apply(null, values));

  renderStatCards(total, surveys.length, surveys[topIndex] ? surveys[topIndex].title : "—");
  renderChart(labels, values);
});

function fetchCounts() {
  if (!APPS_SCRIPT_URL) {
    return Promise.resolve({ data: DEMO_COUNTS, isDemo: true });
  }
  return fetch(APPS_SCRIPT_URL)
    .then(function (res) {
      if (!res.ok) throw new Error("Apps Script вернул ошибку");
      return res.json();
    })
    .then(function (data) { return { data: data, isDemo: false }; })
    .catch(function (err) {
      console.error("Не удалось получить статистику из Apps Script, показаны демо-данные:", err);
      return { data: DEMO_COUNTS, isDemo: true };
    });
}

function renderStatCards(total, surveyCount, topTitle) {
  var row = document.getElementById("stat-row");
  row.innerHTML =
    statCard(total, "Всего пройдено опросов") +
    statCard(surveyCount, "Опросов доступно") +
    statCard(topTitle, "Самый популярный");
}

function statCard(num, label) {
  return (
    '<div class="stat-card"><div class="num">' + num + "</div>" +
    '<div class="label">' + label + "</div></div>"
  );
}

function renderChart(labels, values) {
  var ctx = document.getElementById("results-chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Пройдено раз",
        data: values,
        backgroundColor: labels.map(function (_, i) { return PALETTE[i % PALETTE.length]; }),
        borderRadius: 4,
        maxBarThickness: 64
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  });
}

window.WatchNext = window.WatchNext || {};
window.WatchNext.pages = window.WatchNext.pages || {};

window.WatchNext.pages.AnalyticsPage = function AnalyticsPage() {
  const { data, components } = window.WatchNext;
  const tasteTags = [
    { label: "Sci-fi obsessive", color: "purple" },
    { label: "Thoughtful viewer", color: "blue" },
    { label: "Slow-burn fan", color: "red" },
    { label: "Atmospheric", color: "purple" },
  ];

  return `
    <div class="analytics-page">
      <div class="taste-hero">
        <div>
          <h2>Your taste profile</h2>
          <p>Based on 247 films and 38 series</p>
          ${components.Tags(tasteTags)}
        </div>
        <div class="score">
          <div>8.1</div>
          <div>average rating</div>
        </div>
      </div>
      <div class="charts">
        <div class="chart-card">
          <div class="chart-title">Top genres</div>
          <div class="mini-list">
            ${data.genres.map((item) => `
              <div class="mini-row">
                <div class="dot" style="background:${item.color}"></div>
                <strong>${item.label}</strong>
                <span>${item.value}</span>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-title">Monthly films watched</div>
          ${data.monthlyFilms.map((item) => `
            <div class="bar-row">
              <span>${item.month}</span>
              <div class="bar-track"><div class="bar" style="width:${item.width}%"></div></div>
              <span>${item.count}</span>
            </div>
          `).join("")}
        </div>
        <div class="chart-card">
          <div class="chart-title">Favourite directors</div>
          <div class="mini-list">
            ${data.directors.map((item) => `
              <div class="mini-row">
                <div class="avatar">${item.initials}</div>
                <strong>${item.name}</strong>
                <span>${item.value}</span>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-title">✦ AI taste summary</div>
          <p class="summary">You prefer cerebral sci-fi and atmospheric thrillers with slow-burn pacing, visual worldbuilding, ambiguous endings and philosophical tension. Friday evenings are your strongest watch window.</p>
        </div>
      </div>
    </div>
  `;
};

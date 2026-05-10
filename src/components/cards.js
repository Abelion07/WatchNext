window.WatchNext = window.WatchNext || {};
window.WatchNext.components = window.WatchNext.components || {};

window.WatchNext.components.PosterCard = function PosterCard(item) {
  return `
    <article class="poster">
      <div class="poster-art" style="background:${item.background}">${item.emoji}</div>
      <div class="poster-info">
        <div class="poster-title">${item.title}</div>
        <div class="poster-meta">${item.meta}</div>
        <div class="rating">★ ${item.rating}</div>
      </div>
    </article>
  `;
};

window.WatchNext.components.FeatureCard = function FeatureCard(item) {
  return `
    <article class="feature">
      <div class="feature-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `;
};

window.WatchNext.components.ContinueCard = function ContinueCard(item) {
  return `
    <article class="continue-card">
      <div class="thumb" style="background:${item.background}">
        ${item.emoji}
        <div class="progress"><div style="width:${item.progress}%"></div></div>
      </div>
      <div class="card-info">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">${item.meta}</div>
      </div>
    </article>
  `;
};

window.WatchNext.components.StatCard = function StatCard(item) {
  return `
    <article class="stat-card">
      <div class="stat-value" style="color:${item.color}">${item.value}</div>
      <div class="stat-label">${item.label}</div>
    </article>
  `;
};

window.WatchNext.components.RecommendationCard = function RecommendationCard(item) {
  return `
    <article class="rec-card">
      <div class="rec-art" style="background:${item.background}">${item.emoji}</div>
      <div class="card-info">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">${item.meta}</div>
        <div class="ai-badge">✦ ${item.match}</div>
      </div>
    </article>
  `;
};

window.WatchNext.components.Panel = function Panel(title, content) {
  return `
    <div class="panel">
      <h3>${title}</h3>
      ${content}
    </div>
  `;
};

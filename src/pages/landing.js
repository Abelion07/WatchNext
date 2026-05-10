window.WatchNext = window.WatchNext || {};
window.WatchNext.pages = window.WatchNext.pages || {};

window.WatchNext.pages.LandingPage = function LandingPage() {
  const { data, components } = window.WatchNext;

  return `
    <div class="hero">
      <div class="badge">✦ AI-powered entertainment OS</div>
      <h1>Stop scrolling.<br><span>Start watching.</span></h1>
      <p>Your personal movie and series brain. Track everything you watch, discover what fits your mood, and let AI or roulette pick your next obsession.</p>
      <div class="hero-actions">
        <button class="btn-primary" data-page="dashboard">Open dashboard →</button>
        <button class="btn-ghost" data-page="ai">Try AI assistant</button>
      </div>
      <div class="poster-strip">
        ${data.posters.map(components.PosterCard).join("")}
      </div>
    </div>
    <div class="features">
      ${data.features.map(components.FeatureCard).join("")}
    </div>
  `;
};

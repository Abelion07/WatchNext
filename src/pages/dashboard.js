window.WatchNext = window.WatchNext || {};
window.WatchNext.pages = window.WatchNext.pages || {};

window.WatchNext.pages.DashboardPage = function DashboardPage() {
  const { data, components } = window.WatchNext;

  return `
    <div class="dash-hero">
      <div>
        <div class="dash-kicker">Good evening, Ábel 👋</div>
        <div class="dash-title">What are we watching tonight?</div>
        <div class="dash-sub">You have <span>12 titles in your watchlist</span> · AI picked 3 for tonight</div>
      </div>
    </div>

    ${components.SectionHeader("Continue watching", "View all")}
    <div class="horizontal">
      ${data.continueWatching.map(components.ContinueCard).join("")}
    </div>

    <div class="stats">
      ${data.stats.map(components.StatCard).join("")}
    </div>

    ${components.SectionHeader("✨ AI picks for tonight", "Ask AI →", "ai")}
    <div class="horizontal">
      ${data.aiPicks.map(components.RecommendationCard).join("")}
    </div>
  `;
};

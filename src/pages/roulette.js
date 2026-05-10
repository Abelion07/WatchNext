window.WatchNext = window.WatchNext || {};
window.WatchNext.pages = window.WatchNext.pages || {};

window.WatchNext.pages.RoulettePage = function RoulettePage() {
  const { data, components } = window.WatchNext;

  return `
    <div class="roulette-page">
      <h2>🎡 Watch Roulette</h2>
      <p>Can't decide? Filter your watchlist and let fate choose.</p>
      ${components.Filters(data.rouletteFilters)}
      ${components.Wheel()}
      ${components.PickedCard(data.movies[1])}
    </div>
  `;
};

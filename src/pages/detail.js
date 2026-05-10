window.WatchNext = window.WatchNext || {};
window.WatchNext.pages = window.WatchNext.pages || {};

window.WatchNext.pages.DetailPage = function DetailPage() {
  const { data, components } = window.WatchNext;
  const detailTags = [
    { label: "Sci-fi", color: "purple" },
    { label: "Thriller", color: "blue" },
    { label: "Drama", color: "red" },
  ];

  const cast = `
    <div class="cast">
      ${data.cast.map((actor) => `
        <div class="cast-card">
          <div class="cast-avatar">${actor.emoji}</div>
          <div>${actor.name}</div>
        </div>
      `).join("")}
    </div>
  `;

  return `
    <div class="detail-hero">
      <div class="detail-meta">
        <div class="detail-poster">🤖</div>
        <div class="detail-info">
          <h2>Ex Machina</h2>
          <p>2014 · Alex Garland · A24 · 1h 48m</p>
          <p><span style="color:var(--gold);font-weight:800">★ 7.7</span> IMDb · Your rating: <span style="color:var(--purple-light);font-weight:800">9/10</span></p>
          ${components.Tags(detailTags)}
        </div>
      </div>
    </div>
    <div class="detail-body">
      <div>
        <div class="detail-actions">
          <select class="status-select">
            <option>✓ Completed</option>
            <option>▶ Watching</option>
            <option>📋 Planned</option>
            <option>⟳ Rewatching</option>
            <option>⏸ On Hold</option>
            <option>✗ Dropped</option>
          </select>
          <button class="btn-small primary">+ Watchlist</button>
          <button class="btn-small ghost">♡ Favourite</button>
          <button class="btn-small ghost">▶ Trailer</button>
        </div>
        ${components.Panel("Synopsis", "<p>A programmer is selected to participate in a ground-breaking experiment in artificial intelligence by evaluating the human qualities of a highly advanced humanoid A.I. A taut, cerebral thriller with stunning production design.</p>")}
        <div style="height:14px"></div>
        ${components.Panel("Cast", cast)}
      </div>
      <aside>
        ${components.Panel("✦ Why recommended", "<p>You rated Annihilation and Arrival highly. Ex Machina matches your preference for slow-burn sci-fi, philosophical tension, compact runtime and visually clean production design.</p>")}
        <div style="height:14px"></div>
        ${components.Panel("Where to watch", components.Tags([{ label: "Netflix", color: "red" }, { label: "Prime", color: "blue" }]))}
        <div style="height:14px"></div>
        ${components.Panel("Your notes", '<textarea placeholder="Add a personal note about this film..."></textarea>')}
      </aside>
    </div>
  `;
};

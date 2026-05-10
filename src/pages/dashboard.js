export function Dashboard() {
  return `<section id="dashboard" class="page active">
        <div class="dash-hero">
          <div>
            <div class="dash-kicker">Good evening, Ábel 👋</div>
            <div class="dash-title">What are we watching tonight?</div>
            <div class="dash-sub">You have <span>12 titles in your watchlist</span> · AI picked 3 for tonight</div>
          </div>
        </div>

        <div class="section"><div class="section-head"><div class="section-title">Continue watching</div><div class="section-link">View all</div></div></div>
        <div class="horizontal">
          <article class="continue-card"><div class="thumb" style="background:linear-gradient(135deg,#020617,#4c1d95)">🔬<div class="progress"><div style="width:65%"></div></div></div><div class="card-info"><div class="card-title">Severance</div><div class="card-meta">S2 E5 · 65% done</div></div></article>
          <article class="continue-card"><div class="thumb" style="background:linear-gradient(135deg,#1c0900,#78350f)">🎪<div class="progress"><div style="width:30%"></div></div></div><div class="card-info"><div class="card-title">The White Lotus</div><div class="card-meta">S3 E2 · 30% done</div></div></article>
          <article class="continue-card"><div class="thumb" style="background:linear-gradient(135deg,#03120a,#064e3b)">🌿<div class="progress"><div style="width:88%"></div></div></div><div class="card-info"><div class="card-title">The Last of Us</div><div class="card-meta">S2 E6 · 88% done</div></div></article>
        </div>

        <div class="stats">
          <article class="stat-card"><div class="stat-value" style="color:var(--purple-light)">247</div><div class="stat-label">Films watched</div></article>
          <article class="stat-card"><div class="stat-value" style="color:var(--red-light)">38</div><div class="stat-label">Series tracked</div></article>
          <article class="stat-card"><div class="stat-value" style="color:var(--blue-light)">412h</div><div class="stat-label">Watch time</div></article>
          <article class="stat-card"><div class="stat-value" style="color:var(--gold)">8.1</div><div class="stat-label">Average rating</div></article>
        </div>

        <div class="section"><div class="section-head"><div class="section-title">✨ AI picks for tonight</div><div class="section-link" data-page="ai">Ask AI →</div></div></div>
        <div class="horizontal">
          <article class="rec-card"><div class="rec-art" style="background:linear-gradient(135deg,#090026,#4c1d95)">🌌</div><div class="card-info"><div class="card-title">Arrival</div><div class="card-meta">2016 · Sci-fi · 1h 56m</div><div class="ai-badge">✦ 97% match</div></div></article>
          <article class="rec-card"><div class="rec-art" style="background:linear-gradient(135deg,#1c0900,#7c2d12)">🔥</div><div class="card-info"><div class="card-title">Prisoners</div><div class="card-meta">2013 · Thriller · 2h 33m</div><div class="ai-badge">✦ 91% match</div></div></article>
          <article class="rec-card"><div class="rec-art" style="background:linear-gradient(135deg,#00111f,#075985)">🌊</div><div class="card-info"><div class="card-title">Annihilation</div><div class="card-meta">2018 · Sci-fi · 1h 55m</div><div class="ai-badge">✦ 89% match</div></div></article>
          <article class="rec-card"><div class="rec-art" style="background:linear-gradient(135deg,#0a0a0a,#312e81)">🛸</div><div class="card-info"><div class="card-title">Ex Machina</div><div class="card-meta">2014 · Sci-fi · 1h 48m</div><div class="ai-badge">✦ 88% match</div></div></article>
        </div>
      </section>`;
}

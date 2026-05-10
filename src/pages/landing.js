export function Landing() {
  return `
    <section id="landing" class="page">
        <div class="hero">
          <div class="badge">✦ AI-powered entertainment OS</div>
          <h1>Stop scrolling.<br><span>Start watching.</span></h1>
          <p>Your personal movie and series brain. Track everything you watch, discover what fits your mood, and let AI or roulette pick your next obsession.</p>
          <div class="hero-actions">
            <button class="btn-primary" data-page="dashboard">Open dashboard →</button>
            <button class="btn-ghost" data-page="ai">Try AI assistant</button>
          </div>
          <div class="poster-strip">
            <article class="poster"><div class="poster-art" style="background:linear-gradient(135deg,#090026,#4c1d95)">🌌</div><div class="poster-info"><div class="poster-title">Dune: Part Two</div><div class="poster-meta">2024 · Sci-fi</div><div class="rating">★ 8.5</div></div></article>
            <article class="poster"><div class="poster-art" style="background:linear-gradient(135deg,#01130a,#064e3b)">🔬</div><div class="poster-info"><div class="poster-title">Severance</div><div class="poster-meta">2022 · Thriller</div><div class="rating">★ 8.7</div></div></article>
            <article class="poster"><div class="poster-art" style="background:linear-gradient(135deg,#1c0900,#7c2d12)">🔱</div><div class="poster-info"><div class="poster-title">Oppenheimer</div><div class="poster-meta">2023 · Drama</div><div class="rating">★ 8.3</div></div></article>
            <article class="poster"><div class="poster-art" style="background:linear-gradient(135deg,#030712,#1e3a8a)">🤖</div><div class="poster-info"><div class="poster-title">Ex Machina</div><div class="poster-meta">2014 · Sci-fi</div><div class="rating">★ 7.7</div></div></article>
            <article class="poster"><div class="poster-art" style="background:linear-gradient(135deg,#190019,#86198f)">🎭</div><div class="poster-info"><div class="poster-title">The Bear</div><div class="poster-meta">2022 · Drama</div><div class="rating">★ 8.6</div></div></article>
          </div>
        </div>
        <div class="features">
          <article class="feature"><div class="feature-icon">🧠</div><h3>AI recommendations</h3><p>Describe your mood and get personalized picks based on your history, ratings, genres and runtime preferences.</p></article>
          <article class="feature"><div class="feature-icon">🎡</div><h3>Watch roulette</h3><p>Can't decide? Filter your watchlist, spin the wheel, and let fate choose what you watch tonight.</p></article>
          <article class="feature"><div class="feature-icon">📊</div><h3>Taste analytics</h3><p>See your favorite genres, directors, monthly watch time and an AI-generated taste profile.</p></article>
          <article class="feature"><div class="feature-icon">📚</div><h3>Personal library</h3><p>Track movies and series with statuses like Watching, Completed, Planned, Dropped and Rewatching.</p></article>
          <article class="feature"><div class="feature-icon">⚡</div><h3>Tonight mode</h3><p>Tell WatchNext how much time and energy you have. It gives one confident recommendation.</p></article>
          <article class="feature"><div class="feature-icon">✨</div><h3>Why this?</h3><p>Every AI pick comes with a short explanation: why it matches your taste and when to watch it.</p></article>
        </div>
      </section>
    `;
}

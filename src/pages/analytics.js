export function Analytics() {
  return `
    <section id="analytics" class="page">
        <div class="analytics-page profile-screen">
          <div class="profile-cover">
            <div class="profile-topbar">
              <button class="icon-button" type="button" data-page="dashboard" aria-label="Back">‹</button>
              <div class="detail-top-actions">
                <button class="icon-button" type="button" aria-label="Search">⌕</button>
                <button class="icon-button" type="button" aria-label="More">⋮</button>
              </div>
            </div>
          </div>
          <div class="profile-head">
            <div class="profile-avatar">ÁB</div>
            <div class="profile-actions">
              <button class="btn-small primary" type="button">Follow</button>
              <button class="btn-small ghost" type="button">Message</button>
            </div>
            <h2>Ábel Csukás</h2>
            <p>@watchnext</p>
            <div class="profile-stats">
              <strong>247 <span>Films</span></strong>
              <strong>38 <span>Following</span></strong>
              <strong>112 <span>Follower</span></strong>
            </div>
            <div class="profile-tabs">
              <button type="button">Post</button>
              <button class="active" type="button">Watched</button>
              <button type="button">Watchlist</button>
              <button type="button">Reviews</button>
            </div>
          </div>
          <div class="profile-section-title">Taste Profile <span>›</span></div>
          <div class="taste-cards">
            <article class="taste-card"><strong>🚀 Sci-Fi</strong><span>82%</span><div><i style="width:82%"></i></div></article>
            <article class="taste-card"><strong>🎭 Drama</strong><span>31%</span><div><i style="width:31%"></i></div></article>
            <article class="taste-card"><strong>😀 Comedy</strong><span>12%</span><div><i style="width:12%"></i></div></article>
          </div>
          <div class="profile-section-title">Recently Watched <span>›</span></div>
          <div class="profile-poster-grid">
            <article><div style="background-image:url(https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg)"></div><strong>★ 8.4</strong><span>Dune</span></article>
            <article><div style="background-image:url(https://image.tmdb.org/t/p/w500/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg)"></div><strong>★ 7.7</strong><span>Ex Machina</span></article>
            <article><div style="background-image:url(https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg)"></div><strong>★ 8.0</strong><span>Oppenheimer</span></article>
            <article><div style="background-image:url(https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg)"></div><strong>★ 8.5</strong><span>Interstellar</span></article>
          </div>
        </div>
      </section>
    `;
}

import { getWatchedMovies } from "../services/moviesApi.js";

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
              <strong><span data-analytics-films-count>0</span> <span>Films</span></strong>
              <strong>38 <span>Following</span></strong>
              <strong>112 <span>Followers</span></strong>
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
          <div class="profile-poster-grid" data-analytics-watched>
            <div class="card-meta">Loading watched movies...</div>
          </div>
        </div>
      </section>
    `;
}

export function loadAnalyticsMovies() {
  if (!loadAnalyticsMovies.listenerAttached) {
    document.addEventListener("movies:changed", () => {
      renderAnalyticsWatchedMovies();
    });
    loadAnalyticsMovies.listenerAttached = true;
  }

  renderAnalyticsWatchedMovies();
}

async function renderAnalyticsWatchedMovies() {
  const posterlink = "https://image.tmdb.org/t/p/w500";
  const analytics = document.querySelector("#analytics");
  const watchedGrid = analytics?.querySelector("[data-analytics-watched]");
  const filmsCount = analytics?.querySelector("[data-analytics-films-count]");

  if (!analytics || !watchedGrid || !filmsCount) return;

  try {
    const watchedMovies = await getWatchedMovies();
    const visibleWatchedMovies = groupWatchedMovies(watchedMovies.filter((movie) => movie.title));

    filmsCount.textContent = String(visibleWatchedMovies.length);
    watchedGrid.innerHTML =
      visibleWatchedMovies.slice(0, 4).map((movie) => renderWatchedPoster(movie, posterlink)).join("") ||
      `<div class="card-meta">No watched movies yet.</div>`;
  } catch (error) {
    filmsCount.textContent = "0";
    watchedGrid.innerHTML = `<div class="card-meta">${escapeHtml(error.message)}</div>`;
  }
}

function renderWatchedPoster(movie, posterlink) {
  const posterStyle = movie.poster_path
    ? `background-image:url(${posterlink + movie.poster_path})`
    : "";
  const rating = Number(movie.user_vote || movie.vote_average || 0);
  const ratingText = rating > 0 ? `★ ${rating.toFixed(1)}` : "Watched";

  return `
    <article data-title="${escapeHtml(movie.title)}">
      <div style="${posterStyle}"></div>
      <strong>${escapeHtml(ratingText)}</strong>
      <span>${escapeHtml(movie.title)}</span>
    </article>
  `;
}

function groupWatchedMovies(movies) {
  const groupedMovies = new Map();

  movies.forEach((movie) => {
    const tmdbId = String(movie.tmdb_id || movie.id);
    const existingMovie = groupedMovies.get(tmdbId);

    if (!existingMovie) {
      groupedMovies.set(tmdbId, {
        ...movie,
        watch_count: 1,
      });
      return;
    }

    existingMovie.watch_count += 1;
    if (new Date(movie.watched_at || 0) > new Date(existingMovie.watched_at || 0)) {
      groupedMovies.set(tmdbId, {
        ...existingMovie,
        ...movie,
        watch_count: existingMovie.watch_count,
      });
    }
  });

  return [...groupedMovies.values()];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

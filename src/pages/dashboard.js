import { renderMovieDetail } from "./FilmDetail.js";
import { searchMovie } from "../services/tmdb.js";
import {
  getRecommendedMovies,
  getWatchedMovies,
  getWatchlistMovies,
} from "../services/moviesApi.js";

export function Dashboard() {
  return `<section id="dashboard" class="page active">
        <div class="dash-hero">
          <div>
            <div class="dash-kicker">Good evening, Ábel 👋</div>
            <div class="dash-title">What are we watching tonight?</div>
            <div class="dash-sub" data-dashboard-summary>Loading your watchlist...</div>
          </div>
        </div>

        <div class="section">
        <div class="section-head">
        <div class="section-title">Start watching</div>
            <div class="section-actions">
              <button class="btn-small primary" type="button" data-open-add-movie>+ Add Movie</button>
              <div class="section-link" data-page="continue">View all</div>
            </div>
          </div>
        </div>

        <div class="horizontal" data-dashboard-watchlist>
          <div class="card-meta" data-dashboard-loading>Loading movies from database...</div>
        </div>

        <div class="stats">
          <article class="stat-card"><div class="stat-value" style="color:#F4F4F5" data-dashboard-stat="films">0</div><div class="stat-label">Films watched</div></article>
          <article class="stat-card"><div class="stat-value" style="color:#F4F4F5" data-dashboard-stat="series">0</div><div class="stat-label">Series tracked</div></article>
          <article class="stat-card"><div class="stat-value" style="color:#F4F4F5" data-dashboard-stat="watch-time">0h</div><div class="stat-label">Watch time</div></article>
          <article class="stat-card"><div class="stat-value" style="color:#F4F4F5" data-dashboard-stat="rating">0.0</div><div class="stat-label">Average rating</div></article>
        </div>

        <div class="section">
          <div class="section-head">
            <div class="section-title">✨ AI recs for you</div>
            <div class="section-actions">
              <div class="row-scroll-controls" aria-label="Recommendation navigation">
                <button class="scroll-arrow" type="button" data-scroll-recommendations="left" aria-label="Scroll recommendations left" title="Previous">‹</button>
                <button class="scroll-arrow" type="button" data-scroll-recommendations="right" aria-label="Scroll recommendations right" title="Next">›</button>
              </div>
              <div class="section-link" data-page="ai">Ask AI →</div>
            </div>
          </div>
        </div>
        <div class="horizontal" data-dashboard-recommendations>
          <div class="card-meta">Loading recommendations...</div>
        </div>

        <div class="section">
          <div class="section-head">
            <div>
              <div class="section-title">Watched Movies</div>
              <div class="library-subtitle" data-dashboard-watched-summary>Loading watched movies...</div>
            </div>
          </div>
        </div>
        <div class="horizontal" data-dashboard-watched>
          <div class="card-meta">Loading watched movies...</div>
        </div>
      </section>`;
}

export function loadDashboardMovies() {
  const posterlink = "https://image.tmdb.org/t/p/w500";

  if (!loadDashboardMovies.infoListenerAttached) {
    document.addEventListener("click", async (event) => {
      const infoButton = event.target.closest(".information-button");
      if (!infoButton) return;

      const card = infoButton.closest("[data-title]");
      const title = card?.dataset.title;
      if (!title) return;

      try {
        infoButton.textContent = "Loading...";
        const movie = await searchMovie(title);
        renderMovieDetail(movie);

        document.querySelectorAll(".page").forEach((page) => {
          page.classList.toggle("active", page.id === "detail");
        });
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.toggle("active", link.dataset.page === "detail");
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } finally {
        infoButton.textContent = "Info";
      }
    });

    document.addEventListener("movies:changed", () => {
      renderDashboardFromDatabase(posterlink);
    });
    document.addEventListener("click", (event) => {
      const scrollButton = event.target.closest("[data-scroll-recommendations]");
      if (!scrollButton) return;

      const dashboard = document.querySelector("#dashboard");
      const recommendationsRow = dashboard?.querySelector("[data-dashboard-recommendations]");
      if (!recommendationsRow) return;

      const direction = scrollButton.dataset.scrollRecommendations === "left" ? -1 : 1;
      const card = recommendationsRow.querySelector(".rec-card");
      const scrollStep = card ? card.getBoundingClientRect().width + 14 : 430;
      recommendationsRow.scrollBy({
        left: direction * scrollStep * 2,
        behavior: "smooth",
      });
    });
    document.addEventListener("scroll", (event) => {
      if (event.target?.matches?.("[data-dashboard-recommendations]")) {
        updateRecommendationScrollButtons();
      }
    }, true);

    loadDashboardMovies.infoListenerAttached = true;
  }

  renderDashboardFromDatabase(posterlink);
}

async function renderDashboardFromDatabase(posterlink) {
  const dashboard = document.querySelector("#dashboard");
  const movieRow = dashboard?.querySelector("[data-dashboard-watchlist]");
  const watchedRow = dashboard?.querySelector("[data-dashboard-watched]");
  const recommendationsRow = dashboard?.querySelector("[data-dashboard-recommendations]");
  const summary = dashboard?.querySelector("[data-dashboard-summary]");
  const watchedSummary = dashboard?.querySelector("[data-dashboard-watched-summary]");

  if (
    !dashboard ||
    !movieRow ||
    !watchedRow ||
    !recommendationsRow ||
    !summary ||
    !watchedSummary
  ) {
    return;
  }

  try {
    const [movies, watchedMovies, recommendations] = await Promise.all([
      getWatchlistMovies(),
      getWatchedMovies({ force: true }),
      getRecommendedMovies(10),
    ]);
    const watchlistMovies = movies.filter((movie) => movie.title);
    const visibleWatchedMovies = groupWatchedMovies(watchedMovies.filter((movie) => movie.title));
    const recommendedMovies = recommendations.movies.filter((movie) => movie.title);
    renderDashboardStats(dashboard, visibleWatchedMovies);

    summary.innerHTML = `You have <span>${movies.length} titles in your watchlist</span> · ${recommendedMovies.length} new genre picks`;
    movieRow.innerHTML =
      watchlistMovies.map(renderContinueCard).join("") ||
      `<div class="card-meta">No movies found in your watchlist.</div>`;
    recommendationsRow.innerHTML =
      recommendedMovies.map(renderRecommendationCard).join("") ||
      `<div class="card-meta">No recommendations yet. Add or watch movies with saved genre numbers first.</div>`;
    requestAnimationFrame(updateRecommendationScrollButtons);
    watchedSummary.textContent = `${visibleWatchedMovies.length} watched titles · ${watchedMovies.length} total watches`;
    watchedRow.innerHTML =
      visibleWatchedMovies.map(renderWatchedCard).join("") ||
      `<div class="card-meta">No watched movies yet.</div>`;
  } catch (error) {
    summary.textContent = "Could not load movies from database.";
    movieRow.innerHTML = `<div class="card-meta">${error.message}</div>`;
    recommendationsRow.innerHTML = `<div class="card-meta">${error.message}</div>`;
    updateRecommendationScrollButtons();
    watchedSummary.textContent = "Could not load watched movies.";
    watchedRow.innerHTML = `<div class="card-meta">${error.message}</div>`;
    renderDashboardStats(dashboard, []);
  }

  function renderContinueCard(movie) {
    return `
      <article class="continue-card" data-title="${movie.title}">
        <div class="thumb" style="background-image:url(${posterlink + movie.poster_path})"></div>
        <div class="card-info">
          <div class="card-title-row">
            <div class="card-title">${movie.title}</div>
            <div class="movie-rating">⭐ ${Number(movie.vote_average || 0).toFixed(1)}</div>
          </div>
          <div class="card-meta">${formatMovieMeta(movie)}</div>
          <div class="information-button">Info</div>
        </div>
      </article>
    `;
  }

  function renderWatchedCard(movie) {
    const watchedDate = movie.watched_at
      ? new Intl.DateTimeFormat("hu-HU", {
          month: "short",
          day: "numeric",
        }).format(new Date(movie.watched_at))
      : "Watched";

    const watchCountLabel =
      Number(movie.watch_count || 0) > 1
        ? `${movie.watch_count} megtekintés`
        : "1 megtekintés";

    return `
      <article class="continue-card watched-card" data-title="${movie.title}">
        <div class="thumb" style="background-image:url(${posterlink + movie.poster_path})"></div>
        <div class="card-info">
          <div class="card-title-row">
            <div class="card-title">${movie.title}</div>
            <div class="movie-rating">${Number(movie.user_vote || 0).toFixed(1)}</div>
          </div>
          <div class="card-meta">${watchCountLabel} · ${watchedDate} · ${formatMovieMeta(movie)}</div>
          <div class="information-button">Info</div>
        </div>
      </article>
    `;
  }

  function renderRecommendationCard(movie) {
    return `
      <article class="rec-card" data-title="${escapeHtml(movie.title)}">
        <div class="rec-art" style="background-image:url(${posterlink + movie.poster_path})"></div>
        <div class="card-info">
          <div class="card-title-row">
            <div class="card-title">${escapeHtml(movie.title)}</div>
            <div class="movie-rating">⭐ ${Number(movie.vote_average || 0).toFixed(1)}</div>
          </div>
          <div class="card-meta">${formatMovieMeta(movie)}</div>
          <div class="ai-badge">Genre #${escapeHtml(movie.genre_id || "")}</div>
          <div class="information-button">Info</div>
        </div>
      </article>
    `;
  }

}

function renderDashboardStats(dashboard, watchedMovies) {
  const totalWatchTime = watchedMovies.reduce((sum, movie) => {
    return sum + Number(movie.runtime || 0) * Number(movie.watch_count || 1);
  }, 0);
  const ratedMovies = watchedMovies.filter((movie) => Number(movie.user_vote || 0) > 0);
  const averageRating = ratedMovies.length
    ? ratedMovies.reduce((sum, movie) => sum + Number(movie.user_vote || 0), 0) / ratedMovies.length
    : 0;

  setStatText(dashboard, "films", String(watchedMovies.length));
  setStatText(dashboard, "series", "0");
  setStatText(dashboard, "watch-time", formatWatchTime(totalWatchTime));
  setStatText(dashboard, "rating", averageRating ? averageRating.toFixed(1) : "0.0");
}

function setStatText(dashboard, statName, value) {
  const stat = dashboard.querySelector(`[data-dashboard-stat="${statName}"]`);
  if (stat) stat.textContent = value;
}

function updateRecommendationScrollButtons() {
  const dashboard = document.querySelector("#dashboard");
  const recommendationsRow = dashboard?.querySelector("[data-dashboard-recommendations]");
  const leftButton = dashboard?.querySelector('[data-scroll-recommendations="left"]');
  const rightButton = dashboard?.querySelector('[data-scroll-recommendations="right"]');

  if (!recommendationsRow || !leftButton || !rightButton) return;

  const maxScrollLeft = Math.max(
    0,
    recommendationsRow.scrollWidth - recommendationsRow.clientWidth,
  );
  const hasOverflow = maxScrollLeft > 2;

  leftButton.disabled = !hasOverflow || recommendationsRow.scrollLeft <= 2;
  rightButton.disabled = !hasOverflow || recommendationsRow.scrollLeft >= maxScrollLeft - 2;
}

function formatWatchTime(totalMinutes) {
  const minutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) return `${remainingMinutes}m`;
  if (!remainingMinutes) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
}

function groupWatchedMovies(movies) {
  const groupedMovies = new Map();

  movies.forEach((movie) => {
    const tmdbId = String(movie.tmdb_id);
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

function formatMovieMeta(movie) {
  const year = movie.release_date?.split("-")[0] || "Unknown";
  const genre =
    typeof movie.genres === "string"
      ? movie.genres.split(",")[0]
      : movie.genres?.[0]?.name || `Genre #${movie.genre_id || "?"}`;
  const runtime = Number(movie.runtime || 0);
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  const runtimeLabel = runtime ? ` · ${hours} h ${minutes} min` : "";

  return `${year} · ${genre === "Science Fiction" ? "Sci-Fi" : genre}${runtimeLabel}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

import { rec_movies } from "../data/defaultmovies.js";
import { renderMovieDetail } from "./FilmDetail.js";
import { searchMovie } from "../services/tmdb.js";

export function Dashboard() {
  const aiPicks = rec_movies
    .map((movie) => {
      return `
        <article class="rec-card" data-title="${movie.title}">
          <div class="rec-art"></div>
          <div class="card-info">
            <div class="card-title-row">
              <div class="card-title">${movie.title}</div>
              <div class="movie-rating"></div>
            </div>
            <div class="card-meta">${movie.meta || "Loading details..."}</div>
            <div class="ai-badge">✦ 97% match</div>
            <div class="information-button">Info</div>
          </div>
        </article>
      `;
    })
    .join("");

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
            <div class="section-link" data-page="continue">View all</div>
          </div>
        </div>

        <div class="horizontal">
          <div class="card-meta" data-dashboard-loading>Loading movies from database...</div>
        </div>

        <div class="stats">
          <article class="stat-card"><div class="stat-value" style="color:var(--purple-light)">247</div><div class="stat-label">Films watched</div></article>
          <article class="stat-card"><div class="stat-value" style="color:var(--red-light)">38</div><div class="stat-label">Series tracked</div></article>
          <article class="stat-card"><div class="stat-value" style="color:var(--blue-light)">412h</div><div class="stat-label">Watch time</div></article>
          <article class="stat-card"><div class="stat-value" style="color:var(--gold)">8.1</div><div class="stat-label">Average rating</div></article>
        </div>

        <div class="section"><div class="section-head"><div class="section-title">✨ AI picks for tonight</div><div class="section-link" data-page="ai">Ask AI →</div></div></div>
        <div class="horizontal">
          ${aiPicks}
        </div>
      </section>`;
}

export function loadDashboardMovies() {
  const posterlink = "https://image.tmdb.org/t/p/w500";

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

  renderDashboardFromDatabase(posterlink);
  loadAiPickPosters(posterlink);
}

async function renderDashboardFromDatabase(posterlink) {
  const dashboard = document.querySelector("#dashboard");
  const movieRow = dashboard?.querySelector(".horizontal");
  const summary = dashboard?.querySelector("[data-dashboard-summary]");

  if (!dashboard || !movieRow || !summary) return;

  try {
    const response = await fetch(getApiUrl("/api/movies"));
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      throw new Error("The movies API returned HTML instead of JSON. Start the backend with npm start and open http://localhost:3001.");
    }

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Could not load movies.");
    }

    const movies = result.movies || [];
    const inProgressMovies = movies.filter(
      (movie) => movie.status?.toLowerCase() === "released"
    );

    summary.innerHTML = `You have <span>${movies.length} titles in your watchlist</span> · AI picked ${rec_movies.length} for tonight`;
    movieRow.innerHTML =
      inProgressMovies.map(renderContinueCard).join("") ||
      `<div class="card-meta">No movies found in the database.</div>`;
  } catch (error) {
    summary.textContent = "Could not load movies from database.";
    movieRow.innerHTML = `<div class="card-meta">${error.message}</div>`;
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

}

function loadAiPickPosters(posterlink) {
  document.querySelectorAll(".rec-card").forEach(async (card) => {
    const title = card.dataset.title;
    const movie = await searchMovie(title);
    if (!movie) return;

    const cardTitle = card.querySelector(".card-title");
    cardTitle.textContent = movie.title;

    const thumb = card.querySelector(".rec-art");
    thumb.style.backgroundImage = `url(${posterlink + movie.poster_path})`;

    const meta = card.querySelector(".card-meta");
    const rating = card.querySelector(".movie-rating");
    meta.innerHTML = formatTmdbMovieMeta(movie);
    rating.innerHTML = `⭐ ${movie.vote_average.toFixed(1)}`;
  });
}

function getApiUrl(path) {
  const isBackendOrigin =
    window.location.hostname === "localhost" && window.location.port === "3001";

  if (isBackendOrigin) {
    return path;
  }

  return `http://localhost:3001${path}`;
}

function formatMovieMeta(movie) {
  const year = movie.release_date?.split("-")[0] || "Unknown";
  const genre = movie.genres?.split(",")[0] || "Movie";
  const runtime = Number(movie.runtime || 0);
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return `${year} · ${genre === "Science Fiction" ? "Sci-Fi" : genre} · ${hours} h ${minutes} min`;
}

function formatTmdbMovieMeta(movie) {
  const year = movie.release_date?.split("-")[0] || "Unknown";
  const genre = movie.genres?.[0]?.name || "Movie";
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;

  return `${year} · ${genre === "Science Fiction" ? "Sci-Fi" : genre} · ${hours} h ${minutes} min`;
}

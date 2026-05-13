export function ContinueWatching() {
  return `
    <section id="continue" class="page">
      <div class="section library-header">
        <div class="section-head">
          <div>
            <div class="section-title">Continue watching</div>
            <div class="library-subtitle" data-continue-summary>Loading titles...</div>
          </div>
          <div class="section-link" data-page="dashboard">Back to dashboard</div>
        </div>
      </div>

      <div class="movie-grid" data-continue-grid>
        <div class="card-meta">Loading movies from database...</div>
      </div>
    </section>
  `;
}

export async function loadContinueWatching() {
  const posterlink = "https://image.tmdb.org/t/p/w500";

  const section = document.querySelector("#continue");
  const grid = section?.querySelector("[data-continue-grid]");
  const summary = section?.querySelector("[data-continue-summary]");

  if (!section || !grid || !summary) return;

  try {
    const response = await fetch(getApiUrl("/api/movies"));
    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Could not load movies.");
    }

    const movies = result.movies || [];

    const inProgressMovies = movies.filter((movie) => {
      return movie.status?.toLowerCase() === "released";
    });

    summary.textContent = `${inProgressMovies.length} titles in progress`;

    grid.innerHTML =
      inProgressMovies.map((movie) => renderContinueCard(movie)).join("") ||
      `<div class="card-meta">No in-progress movies found.</div>`;
  } catch (error) {
    summary.textContent = "Could not load titles.";
    grid.innerHTML = `<div class="card-meta">${error.message}</div>`;
  }

  function renderContinueCard(movie) {
    const progressPercent = movie.progress || 35;
    const posterUrl = movie.poster_path
      ? `${posterlink}${movie.poster_path}`
      : "";

    return `
      <article class="continue-card" data-title="${movie.title}">
        <div class="thumb" style="${posterUrl ? `background-image:url(${posterUrl})` : ""}">
          <div class="progress">
            <div style="width:${progressPercent}%"></div>
          </div>
        </div>
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
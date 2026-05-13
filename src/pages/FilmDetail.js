export function FilmDetail() {
  return `
    <section id="detail" class="page">
        <div class="detail-hero" data-detail-hero>
          <div class="detail-meta">
            <div class="detail-poster" data-detail-poster>🎬</div>
            <div class="detail-info">
              <h2 data-detail-title>Choose a movie</h2>
              <p data-detail-meta>Open a movie from the dashboard.</p>
              <p><span class="detail-rating" data-detail-rating></span></p>
              <div class="tags" data-detail-genres></div>
            </div>
          </div>
        </div>
        <div class="detail-body">
          <div>
            <div class="detail-actions"><select class="status-select"><option>✓ Completed</option><option>▶ Watching</option><option>📋 Planned</option><option>⟳ Rewatching</option><option>⏸ On Hold</option><option>✗ Dropped</option></select><button class="btn-small primary">+ Watchlist</button><button class="btn-small ghost">♡ Favourite</button><button class="btn-small ghost">▶ Trailer</button></div>
            <div class="panel"><h3>Synopsis</h3><p data-detail-overview>Select Info on a movie card to see its TMDB details here.</p></div>
            <div style="height:14px"></div>
            <div class="panel"><h3>Production</h3><div class="detail-list" data-detail-production></div></div>
          </div>
          <aside>
            <div class="panel"><h3>Details</h3><div class="detail-list" data-detail-facts></div></div>
            <div style="height:14px"></div>
            <div class="panel"><h3>Tagline</h3><p data-detail-tagline>No tagline loaded.</p></div>
            <div style="height:14px"></div>
            <div class="panel"><h3>Your notes</h3><textarea placeholder="Add a personal note about this film..."></textarea></div>
          </aside>
        </div>
      </section>`;
}

const posterBaseUrl = "https://image.tmdb.org/t/p/w500";
const backdropBaseUrl = "https://image.tmdb.org/t/p/w1280";

function formatRuntime(runtime) {
  if (!runtime) return "Runtime unknown";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours} h ${minutes} min`;
}

function formatMoney(value) {
  if (!value) return "Unknown";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateYear(date) {
  return date ? date.split("-")[0] : "Unknown year";
}

function formatLanguage(language) {
  return language ? language.toUpperCase() : "Unknown";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

export function renderMovieDetail(movie) {
  if (!movie) return;

  const hero = document.querySelector("[data-detail-hero]");
  const poster = document.querySelector("[data-detail-poster]");
  const genres = document.querySelector("[data-detail-genres]");
  const production = document.querySelector("[data-detail-production]");
  const facts = document.querySelector("[data-detail-facts]");

  const genreNames = movie.genres?.map((genre) => genre.name) ?? [];
  const companies = movie.production_companies?.slice(0, 4) ?? [];

  if (hero && movie.backdrop_path) {
    hero.style.backgroundImage = `linear-gradient(90deg, rgba(5, 5, 18, 0.92), rgba(5, 5, 18, 0.34)), url(${backdropBaseUrl + movie.backdrop_path})`;
  } else if (hero) {
    hero.style.backgroundImage = "";
  }

  if (poster && movie.poster_path) {
    poster.textContent = "";
    poster.style.backgroundImage = `url(${posterBaseUrl + movie.poster_path})`;
  } else if (poster) {
    poster.textContent = "🎬";
    poster.style.backgroundImage = "";
  }

  setText("[data-detail-title]", movie.title || movie.original_title || "Untitled");
  setText(
    "[data-detail-meta]",
    `${formatDateYear(movie.release_date)} · ${formatRuntime(movie.runtime)} · ${formatLanguage(movie.original_language)}`
  );
  setText("[data-detail-rating]", `⭐ ${movie.vote_average?.toFixed(2) ?? "N/A"} · ${movie.vote_count ?? 0} votes`);
  setText("[data-detail-overview]", movie.overview || "No synopsis available.");
  setText("[data-detail-tagline]", movie.tagline || "No tagline available.");

  if (genres) {
    genres.innerHTML = genreNames
      .map((genre, index) => `<span class="tag ${["purple", "blue", "red"][index % 3]}">${escapeHtml(genre)}</span>`)
      .join("");
  }

  if (production) {
    production.innerHTML = companies.length
      ? companies
          .map((company) => `<div class="detail-row"><strong>${escapeHtml(company.name)}</strong><span>${escapeHtml(company.origin_country || "N/A")}</span></div>`)
          .join("")
      : `<div class="detail-row"><strong>Production</strong><span>Unknown</span></div>`;
  }

  if (facts) {
    facts.innerHTML = `
      <div class="detail-row"><strong>Status</strong><span>${escapeHtml(movie.status || "Unknown")}</span></div>
      <div class="detail-row"><strong>Budget</strong><span>${formatMoney(movie.budget)}</span></div>
      <div class="detail-row"><strong>Revenue</strong><span>${formatMoney(movie.revenue)}</span></div>
      <div class="detail-row"><strong>Popularity</strong><span>${movie.popularity?.toFixed(1) ?? "N/A"}</span></div>
      <div class="detail-row"><strong>TMDB ID</strong><span>${movie.id ?? "N/A"}</span></div>
    `;
  }
}

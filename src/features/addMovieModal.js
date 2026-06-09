import { getMovieDetails, searchMovies } from "../services/tmdb.js";
import { renderMovieDetail } from "../pages/FilmDetail.js";

const posterBaseUrl = "https://image.tmdb.org/t/p/w185";
let searchTimeout;

export function initAddMovieModal() {
  if (!document.querySelector("[data-add-movie-modal]")) {
    document.body.insertAdjacentHTML("beforeend", renderModal());
  }

  const modal = document.querySelector("[data-add-movie-modal]");
  const input = modal.querySelector("[data-movie-search-input]");
  const results = modal.querySelector("[data-movie-search-results]");

  document.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-open-add-movie]");
    const closeButton = event.target.closest("[data-close-add-movie]");
    const backdrop = event.target === modal;

    if (openButton) {
      openModal(modal, input, results);
      return;
    }

    if (closeButton || backdrop) {
      closeModal(modal);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal(modal);
    }
  });

  input.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    const query = input.value.trim();

    if (query.length < 2) {
      results.innerHTML = `<div class="movie-search-empty">Írj be legalább 2 karaktert.</div>`;
      return;
    }

    results.innerHTML = `<div class="movie-search-empty">Keresés...</div>`;
    searchTimeout = setTimeout(() => renderSearchResults(query, results), 300);
  });

  results.addEventListener("click", async (event) => {
    const detailButton = event.target.closest("[data-view-movie-id]");
    if (!detailButton) return;

    const movieId = detailButton.dataset.viewMovieId;
    const originalText = detailButton.textContent;

    try {
      detailButton.disabled = true;
      detailButton.textContent = "Betöltés...";

      const movieDetails = await getMovieDetails(movieId);
      renderMovieDetail(movieDetails);
      closeModal(modal);
      showDetailPage();
    } catch (error) {
      detailButton.disabled = false;
      detailButton.textContent = originalText;
      showResultError(results, error.message);
    }
  });
}

function renderModal() {
  return `
    <div class="modal-backdrop" data-add-movie-modal aria-hidden="true">
      <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="add-movie-title">
        <div class="modal-head">
          <div>
            <h2 id="add-movie-title">Film hozzáadása</h2>
            <p>Keress TMDB alapján, majd nézd meg a részletes adatlapot.</p>
          </div>
          <button class="modal-close" type="button" data-close-add-movie aria-label="Bezárás">×</button>
        </div>
        <input
          class="movie-search-input"
          type="search"
          placeholder="Film címe..."
          autocomplete="off"
          data-movie-search-input
        />
        <div class="movie-search-results" data-movie-search-results>
          <div class="movie-search-empty">Kezdj el gépelni a kereséshez.</div>
        </div>
      </div>
    </div>
  `;
}

function openModal(modal, input, results) {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  input.value = "";
  results.innerHTML = `<div class="movie-search-empty">Kezdj el gépelni a kereséshez.</div>`;
  setTimeout(() => input.focus(), 0);
}

function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

async function renderSearchResults(query, results) {
  try {
    const movies = await searchMovies(query);
    const visibleMovies = movies.slice(0, 8);

    results.innerHTML = visibleMovies.length
      ? visibleMovies.map(renderSearchResult).join("")
      : `<div class="movie-search-empty">Nincs találat.</div>`;
  } catch (error) {
    results.innerHTML = `<div class="movie-search-empty">${escapeHtml(error.message)}</div>`;
  }
}

function renderSearchResult(movie) {
  const year = movie.release_date?.split("-")[0] || "Ismeretlen";
  const posterUrl = movie.poster_path ? `${posterBaseUrl}${movie.poster_path}` : "";

  return `
    <article class="movie-search-result">
      <div class="movie-search-poster" style="${posterUrl ? `background-image:url(${posterUrl})` : ""}">${posterUrl ? "" : "🎬"}</div>
      <div class="movie-search-info">
        <div class="movie-search-title">${escapeHtml(movie.title || movie.original_title || "Cím nélkül")}</div>
        <div class="movie-search-meta">${escapeHtml(year)} · ⭐ ${Number(movie.vote_average || 0).toFixed(1)}</div>
        <div class="movie-search-overview">${escapeHtml(movie.overview || "Nincs leírás.")}</div>
      </div>
      <button class="btn-small primary" type="button" data-view-movie-id="${movie.id}">Részletek</button>
    </article>
  `;
}

function showResultError(results, message) {
  const error = document.createElement("div");
  error.className = "movie-search-error";
  error.textContent = message;
  results.prepend(error);
}

function showDetailPage() {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("active", page.id === "detail");
  });
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === "detail");
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

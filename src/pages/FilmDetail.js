import {
  getWatchedStatus,
  isMovieInWatchlist,
  markMovieAsWatched,
  removeMovieFromWatchlist,
  saveMovieToWatchlist,
} from "../services/moviesApi.js";

export function FilmDetail() {
  return `
    <section id="detail" class="page movie-detail-screen">
        <div class="detail-hero" data-detail-hero>
          <div class="detail-topbar">
            <button class="icon-button" type="button" data-page="dashboard" aria-label="Back">‹</button>
            <div class="detail-top-actions">
              <button class="icon-button" type="button" aria-label="Share">⇧</button>
              <button class="icon-button" type="button" aria-label="More">⋮</button>
            </div>
          </div>
          <div class="detail-meta">
            <div class="detail-poster" data-detail-poster>🎬</div>
            <div class="detail-info">
              <h2 data-detail-title>Choose a movie</h2>
              <div class="detail-fact-line">
                <span class="detail-rating" data-detail-rating></span>
                <span data-detail-meta>Open a movie from the dashboard.</span>
              </div>
              <div class="detail-cert-row">
                <span>14+</span>
                <div class="tags" data-detail-genres></div>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-body">
          <div class="detail-main-column">
            <div class="detail-actions">
              <button class="btn-small ghost" type="button" data-add-detail-movie>+ My List</button>
              <div class="remove-menu">
                <button class="btn-small ghost btn-watch-state hidden" type="button" data-remove-detail-movie>On My List</button>
                <div class="remove-popup hidden" data-remove-options>
                  <button class="btn-small ghost" type="button" data-remove-option="watch" data-option-for="watchlist">Watched</button>
                  <button class="btn-small ghost" type="button" data-remove-option="remove">Remove</button>
                  <button class="btn-small ghost" type="button" data-remove-option="add-to-list" data-option-for="watched">Add to my list</button>
                </div>
              </div>
              <button class="btn-small ghost" type="button" data-open-watched-modal>♧ Rate</button>
            </div>
            <div class="detail-action-message" data-detail-action-message></div>
            <div class="detail-overview-block">
              <p data-detail-overview>Select Info on a movie card to see its TMDB details here.</p>
            </div>
            <button class="detail-see-more btn-text" type="button" data-open-details-modal>see more...</button>
            <div class="detail-director-line">Director: <span data-detail-director>Unknown</span></div>
            <div class="detail-tabs" role="tablist">
              <button class="active" type="button">Top Cast & Crew</button>
              <button type="button">Media</button>
              <button type="button">User Reviews</button>
            </div>
            <div class="cast-strip" data-detail-cast>
              <article class="cast-card"><div class="cast-avatar">🎬</div><strong>Cast</strong><span>Open a movie</span></article>
              <article class="cast-card"><div class="cast-avatar">★</div><strong>Media</strong><span>TMDB detail</span></article>
              <article class="cast-card"><div class="cast-avatar">✦</div><strong>Reviews</strong><span>Your notes</span></article>
            </div>
            <div class="detail-review-block hidden" data-detail-review>
              <div class="detail-review-score" data-detail-review-score></div>
              <p class="detail-review-text" data-detail-review-text></p>
            </div>
            <div class="detail-secondary-grid">
              <div class="panel"><h3>Watch history</h3><div class="detail-list" data-watch-history><div class="detail-row"><strong>Watched</strong><span>Not logged yet</span></div></div></div>
              <div class="panel"><h3>Tagline</h3><p data-detail-tagline>No tagline loaded.</p></div>
            </div>
          </div>
        </div>
      </section>
      <div class="watch-modal-backdrop" data-watch-modal aria-hidden="true">
        <aside class="watch-modal-panel" role="dialog" aria-modal="true" aria-labelledby="watch-modal-title">
          <div class="watch-modal-head">
            <div>
              <div class="watch-modal-kicker">Logging</div>
              <h2 id="watch-modal-title">Watched movie</h2>
              <p data-watch-modal-movie>Choose a rating and write a short note.</p>
            </div>
            <button class="modal-close" type="button" data-close-watched-modal aria-label="Close">×</button>
          </div>
          <div class="watch-rating-grid" data-watch-rating>
            ${[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
              .map((rating) => `<button type="button" data-watch-rating-value="${rating}">${rating}</button>`)
              .join("")}
          </div>
          <label class="watch-notes-field">
            <span>Your notes</span>
            <textarea data-watch-notes placeholder="What remained from it? Mood, favorite scene, who would you recommend..."></textarea>
          </label>
          <div class="watch-modal-actions">
            <button class="btn-small ghost" type="button" data-close-watched-modal>Cancel</button>
            <button class="btn-small primary" type="button" data-submit-watched>Save to watched</button>
          </div>
        </aside>
      </div>
      <div class="details-modal-backdrop" data-details-modal aria-hidden="true">
        <aside class="details-modal-panel" role="dialog" aria-modal="true" aria-labelledby="details-modal-title">
          <div class="watch-modal-head">
            <div>
              <div class="watch-modal-kicker">Movie details</div>
              <h2 id="details-modal-title">More information</h2>
              <p class="details-modal-text">Production and technical details for this title.</p>
            </div>
            <button class="modal-close" type="button" data-close-details-modal aria-label="Close">×</button>
          </div>
          <div class="details-modal-content">
            <div class="panel"><h3>Production</h3><div class="detail-list" data-detail-production></div></div>
            <div class="panel"><h3>Details</h3><div class="detail-list" data-detail-facts></div></div>
          </div>
        </aside>
      </div>`;
}

const posterBaseUrl = "https://image.tmdb.org/t/p/w500";
const backdropBaseUrl = "https://image.tmdb.org/t/p/w1280";
let currentMovie = null;
let detailActionsInitialized = false;
let currentMovieInWatchlist = false;
let currentMovieWatchCount = 0;
let currentMovieLatestRating = null;
let currentMovieLatestNotes = "";
let currentMovieIsWatched = false;

export function initFilmDetailActions() {
  if (detailActionsInitialized) return;

  document.addEventListener("click", async (event) => {
    const addButton = event.target.closest("[data-add-detail-movie]");
    if (!addButton) return;

    if (!currentMovie) {
      addButton.textContent = "Choose a movie";
      return;
    }

    if (currentMovieInWatchlist) return;

    const originalText = addButton.textContent;

    try {
      setActionMessage("");
      addButton.disabled = true;
      addButton.textContent = "Saving...";
      await saveMovieToWatchlist(currentMovie);
      setWatchlistActionState(true);
      setActionMessage("Hozzáadva a listádhoz.");
      document.dispatchEvent(new CustomEvent("movies:changed"));
    } catch (error) {
      setActionMessage(error.message, true);
      addButton.textContent = error.message;
      setTimeout(() => {
        addButton.textContent = originalText;
      }, 2400);
    } finally {
      addButton.disabled = currentMovieInWatchlist;
    }
  });

  document.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-detail-movie]");
    if (!removeButton || !currentMovie) return;

    const removeOptions = document.querySelector("[data-remove-options]");
    if (removeOptions) {
      removeOptions.classList.remove("hidden");
      // Hide/show options based on current state
      const watchlistOption = removeOptions.querySelector("[data-option-for='watchlist']");
      const watchedOption = removeOptions.querySelector("[data-option-for='watched']");
      
      if (watchlistOption) {
        watchlistOption.classList.toggle("hidden", currentMovieIsWatched);
      }
      if (watchedOption) {
        watchedOption.classList.toggle("hidden", !currentMovieIsWatched);
      }
    }
  });

  document.addEventListener("click", async (event) => {
    const removeOption = event.target.closest("[data-remove-option]");
    if (removeOption && currentMovie) {
      const option = removeOption.dataset.removeOption;
      const removeOptions = document.querySelector("[data-remove-options]");
      const removeButton = document.querySelector("[data-remove-detail-movie]");
      if (removeOptions) removeOptions.classList.add("hidden");
      if (removeButton) removeButton.classList.remove("hidden");

      if (option === "remove") {
        const originalText = removeOption.textContent;
        try {
          setActionMessage("");
          removeOption.disabled = true;
          removeOption.textContent = "Removing...";
          await removeMovieFromWatchlist(currentMovie.id);
          setWatchlistActionState(false);
          setActionMessage("Removed from My List");
          document.dispatchEvent(new CustomEvent("movies:changed"));
        } catch (error) {
          setActionMessage(error.message, true);
          removeOption.textContent = error.message;
          setTimeout(() => {
            removeOption.textContent = originalText;
          }, 2400);
        } finally {
          removeOption.disabled = false;
        }
      } else if (option === "watch") {
        openWatchModal();
      } else if (option === "add-to-list") {
        const originalText = removeOption.textContent;
        try {
          setActionMessage("");
          removeOption.disabled = true;
          removeOption.textContent = "Adding...";
          await saveMovieToWatchlist(currentMovie);
          setWatchlistActionState(true);
          setActionMessage("Added to My List");
          document.dispatchEvent(new CustomEvent("movies:changed"));
        } catch (error) {
          setActionMessage(error.message, true);
          removeOption.textContent = error.message;
          setTimeout(() => {
            removeOption.textContent = originalText;
          }, 2400);
        } finally {
          removeOption.disabled = false;
        }
      } else {
        setActionMessage("Option selected: " + removeOption.textContent);
      }
      return;
    }

    const removeMenuArea = event.target.closest(".remove-menu");
    const removeOptions = document.querySelector("[data-remove-options]");
    if (!removeMenuArea && removeOptions && !removeOptions.classList.contains("hidden")) {
      removeOptions.classList.add("hidden");
    }

    const openButton = event.target.closest("[data-open-watched-modal]");
    const openDetailsButton = event.target.closest("[data-open-details-modal]");
    const closeButton = event.target.closest("[data-close-watched-modal]");
    const closeDetailsButton = event.target.closest("[data-close-details-modal]");
    const modal = document.querySelector("[data-watch-modal]");
    const detailsModal = document.querySelector("[data-details-modal]");

    if (openButton) {
      if (!currentMovie) {
        openButton.textContent = "Válassz filmet";
        return;
      }

      openWatchModal();
      return;
    }

    if (openDetailsButton) {
      if (!currentMovie) {
        openDetailsButton.textContent = "Válassz filmet";
        return;
      }

      openDetailsModal();
      return;
    }

    if (closeButton || event.target === modal) {
      closeWatchModal();
    }

    if (closeDetailsButton || event.target === detailsModal) {
      closeDetailsModal();
    }
  });

  document.addEventListener("click", (event) => {
    const ratingButton = event.target.closest("[data-watch-rating-value]");
    if (!ratingButton) return;

    document.querySelectorAll("[data-watch-rating-value]").forEach((button) => {
      button.classList.toggle("selected", button === ratingButton);
    });
  });

  document.addEventListener("click", async (event) => {
    const watchedButton = event.target.closest("[data-submit-watched]");
    if (!watchedButton) return;

    if (!currentMovie) {
      watchedButton.textContent = "Válassz filmet";
      return;
    }

    const notesInput = document.querySelector("[data-watch-notes]");
    const rating = getSelectedWatchRating();
    const originalText = watchedButton.textContent;

    if (!rating) {
      watchedButton.textContent = "Adj értékelést";
      setTimeout(() => {
        watchedButton.textContent = originalText;
      }, 1800);
      return;
    }

    try {
      setActionMessage("");
      watchedButton.disabled = true;
      watchedButton.textContent = "Mentés...";
      await markMovieAsWatched(currentMovie, rating, notesInput?.value.trim() || "");
      if (currentMovieInWatchlist) {
        await removeMovieFromWatchlist(currentMovie.id);
      }
      currentMovieWatchCount += 1;
      currentMovieLatestRating = rating;
      currentMovieLatestNotes = notesInput?.value.trim() || "";
      setWatchlistActionState(false);
      setWatchedActionState(currentMovieWatchCount, currentMovieLatestRating);
      setReviewBlock(currentMovieLatestRating, currentMovieLatestNotes);
      refreshWatchedActionState(currentMovie.id);
      closeWatchModal();
      setActionMessage(currentMovieWatchCount > 1 ? "Watched again." : "Moved to watched.");
      document.dispatchEvent(new CustomEvent("movies:changed"));
    } catch (error) {
      setActionMessage(error.message, true);
      watchedButton.textContent = error.message;
      setTimeout(() => {
        watchedButton.textContent = originalText;
      }, 2400);
    } finally {
      watchedButton.disabled = false;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeWatchModal();
      closeDetailsModal();
    }
  });

  detailActionsInitialized = true;
}

function openDetailsModal() {
  const modal = document.querySelector("[data-details-modal]");
  if (!modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeDetailsModal() {
  const modal = document.querySelector("[data-details-modal]");
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

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

  currentMovie = movie;
  currentMovieInWatchlist = false;
  currentMovieWatchCount = 0;
  currentMovieLatestRating = null;

  const notesInput = document.querySelector("[data-watch-notes]");
  const watchedButton = document.querySelector("[data-remove-detail-movie]");
  const removeOptions = document.querySelector("[data-remove-options]");
  const modalMovie = document.querySelector("[data-watch-modal-movie]");
  const rateButton = document.querySelector("[data-open-watched-modal]");

  if (notesInput) notesInput.value = "";
  document.querySelectorAll("[data-watch-rating-value]").forEach((button) => {
    button.classList.remove("selected");
  });
  if (watchedButton) {
    watchedButton.disabled = false;
    watchedButton.textContent = "On My List";
    watchedButton.classList.toggle("hidden", !currentMovieInWatchlist);
  }
  if (removeOptions) {
    removeOptions.classList.add("hidden");
  }
  if (rateButton) {
    rateButton.disabled = false;
    rateButton.textContent = "♧ Rate";
  }
  const reviewBlock = document.querySelector("[data-detail-review]");
  const reviewScore = document.querySelector("[data-detail-review-score]");
  const reviewText = document.querySelector("[data-detail-review-text]");
  if (reviewScore) reviewScore.textContent = "";
  if (reviewText) reviewText.textContent = "";
  if (reviewBlock) reviewBlock.classList.add("hidden");
  if (modalMovie) {
    modalMovie.textContent = movie.title || movie.original_title || "Válassz értékelést és jegyzetet.";
  }
  setActionMessage("");

  const hero = document.querySelector("[data-detail-hero]");
  const poster = document.querySelector("[data-detail-poster]");
  const genres = document.querySelector("[data-detail-genres]");
  const production = document.querySelector("[data-detail-production]");
  const facts = document.querySelector("[data-detail-facts]");
  const cast = document.querySelector("[data-detail-cast]");

  const genreNames = movie.genres?.map((genre) => genre.name) ?? [];
  const companies = movie.production_companies?.slice(0, 4) ?? [];
  const castMembers = movie.credits?.cast?.slice(0, 6) ?? [];
  const director =
    movie.credits?.crew?.find((person) => person.job === "Director")?.name ||
    companies[0]?.name ||
    "Unknown";

  if (hero && movie.backdrop_path) {
    hero.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.16) 48%, rgba(5,5,5,0.98) 100%), url(${backdropBaseUrl + movie.backdrop_path})`;
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
  setText("[data-detail-director]", director);

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

  if (cast) {
    cast.innerHTML = castMembers.length
      ? castMembers
          .map((person) => {
            const profileUrl = person.profile_path
              ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
              : "";
            return `
              <article class="cast-card">
                <div class="cast-avatar" style="${profileUrl ? `background-image:url(${profileUrl})` : ""}">${profileUrl ? "" : "★"}</div>
                <strong>${escapeHtml(person.name)}</strong>
                <span>${escapeHtml(person.character || "Cast")}</span>
              </article>
            `;
          })
          .join("")
      : `
        <article class="cast-card"><div class="cast-avatar">🎬</div><strong>Cast</strong><span>Not loaded</span></article>
        <article class="cast-card"><div class="cast-avatar">✦</div><strong>Media</strong><span>TMDB detail</span></article>
        <article class="cast-card"><div class="cast-avatar">★</div><strong>Reviews</strong><span>Your notes</span></article>
      `;
  }

  setWatchlistActionState(false, true);
  refreshWatchlistActionState(movie.id);
  refreshWatchedActionState(movie.id);
}

async function refreshWatchlistActionState(tmdbId) {
  try {
    const inWatchlist = await isMovieInWatchlist(tmdbId);

    if (currentMovie && String(currentMovie.id) === String(tmdbId)) {
      setWatchlistActionState(inWatchlist);
    }
  } catch (error) {
    setWatchlistActionState(false);
  }
}

function setWatchlistActionState(inWatchlist, isLoading = false) {
  currentMovieInWatchlist = inWatchlist;

  const addButton = document.querySelector("[data-add-detail-movie]");
  const removeButton = document.querySelector("[data-remove-detail-movie]");

  if (addButton) {
    addButton.classList.toggle("hidden", inWatchlist && !isLoading);
    addButton.disabled = isLoading;
    addButton.textContent = isLoading ? "Checking..." : "+ My List";
  }

  if (removeButton) {
    removeButton.classList.toggle("hidden", !inWatchlist);
    removeButton.disabled = isLoading;
    if (!isLoading) {
      removeButton.textContent = currentMovieIsWatched ? "Watched" : "On My List";
    }
  }

  const removeOptions = document.querySelector("[data-remove-options]");
  if (removeOptions) {
    removeOptions.classList.add("hidden");
  }
}

async function refreshWatchedActionState(tmdbId) {
  try {
    const watchedStatus = await getWatchedStatus(tmdbId);

    if (currentMovie && String(currentMovie.id) === String(tmdbId)) {
      currentMovieWatchCount = watchedStatus.watchCount;
      currentMovieLatestRating = watchedStatus.latestWatch?.user_vote || null;
      currentMovieLatestNotes = watchedStatus.latestWatch?.watch_notes || "";
      setWatchedActionState(watchedStatus.watchCount, currentMovieLatestRating);
      setReviewBlock(currentMovieLatestRating, currentMovieLatestNotes);
      renderWatchHistory(watchedStatus);
    }
  } catch (error) {
    currentMovieWatchCount = 0;
    currentMovieLatestRating = null;
    currentMovieLatestNotes = "";
    setWatchedActionState(0, null);
    setReviewBlock(null, "");
    renderWatchHistory({ watchCount: 0, watches: [] });
  }
}

function setWatchedActionState(watchCount, latestRating = null) {
  const rateButton = document.querySelector("[data-open-watched-modal]");
  const modalTitle = document.querySelector("#watch-modal-title");
  const submitButton = document.querySelector("[data-submit-watched]");
  const removeButton = document.querySelector("[data-remove-detail-movie]");

  currentMovieIsWatched = watchCount > 0;

  if (rateButton) {
    rateButton.textContent = watchCount > 0 && latestRating ? `♧ ${latestRating}/10` : "♧ Rate";
    rateButton.classList.toggle("primary", watchCount > 0);
    rateButton.classList.toggle("ghost", watchCount === 0);
  }
  if (modalTitle) {
    modalTitle.textContent = watchCount > 0 ? "Watch again" : "Watched title";
  }
  if (submitButton) {
    submitButton.textContent = watchCount > 0 ? "Re-Save" : "Save";
  }
  if (removeButton && currentMovieInWatchlist) {
    removeButton.textContent = currentMovieIsWatched ? "Watched" : "On My List";
  }
}

function setReviewBlock(rating, notes) {
  const reviewBlock = document.querySelector("[data-detail-review]");
  const reviewScore = document.querySelector("[data-detail-review-score]");
  const reviewText = document.querySelector("[data-detail-review-text]");

  if (!reviewBlock || !reviewScore || !reviewText) return;

  if (rating && notes) {
    reviewScore.textContent = `Your score: ${rating}/10`;
    reviewText.textContent = notes;
    reviewBlock.classList.remove("hidden");
  } else if (rating) {
    reviewScore.textContent = `Your score: ${rating}/10`;
    reviewText.textContent = notes || "No review text provided.";
    reviewBlock.classList.remove("hidden");
  } else {
    reviewScore.textContent = "";
    reviewText.textContent = "";
    reviewBlock.classList.add("hidden");
  }
}

function openWatchModal() {
  const modal = document.querySelector("[data-watch-modal]");
  if (!modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeWatchModal() {
  const modal = document.querySelector("[data-watch-modal]");
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function getSelectedWatchRating() {
  const selectedRating = document.querySelector("[data-watch-rating-value].selected");
  return Number(selectedRating?.dataset.watchRatingValue || 0);
}

function renderWatchHistory(watchedStatus) {
  const history = document.querySelector("[data-watch-history]");
  if (!history) return;

  const watches = watchedStatus.watches || [];

  if (!watches.length) {
    history.innerHTML = `<div class="detail-row"><strong>Watched</strong><span>Not logged yet</span></div>`;
    return;
  }

  const totalLabel =
    watches.length > 1 ? `${watches.length} times` : "1 time";
  const recentWatches = watches.slice(0, 3);

  history.innerHTML = `
    <div class="detail-row"><strong>Total</strong><span>${totalLabel}</span></div>
    ${recentWatches
      .map((watch, index) => {
        const date = watch.watched_at
          ? new Intl.DateTimeFormat("hu-HU", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(new Date(watch.watched_at))
          : "Unknown date";
        const label = index === 0 ? "Latest" : `#${watches.length - index}`;

        return `<div class="detail-row"><strong>${label}</strong><span>${date} · ${Number(watch.UserVote || 0).toFixed(1)}/10</span></div>`;
      })
      .join("")}
  `;
}

function setActionMessage(message, isError = false) {
  const element = document.querySelector("[data-detail-action-message]");
  if (!element) return;

  element.textContent = message;
  element.classList.toggle("error", isError);
}

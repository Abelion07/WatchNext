export async function saveMovieToWatchlist(movie, userStatus = "queued") {
  const response = await fetch(getApiUrl("/api/movies"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ movie, user_status: userStatus }),
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Nem sikerült hozzáadni a filmet.");
  }

  return result.movie;
}

export async function markMovieAsWatched(movie, userVote, watchNotes) {
  const response = await fetch(getApiUrl("/api/watched"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movie,
      user_vote: userVote,
      watch_notes: watchNotes,
    }),
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Nem sikerült megnézettként menteni.");
  }

  return result.watched;
}

export async function getWatchedStatus(tmdbId) {
  const response = await fetch(getApiUrl(`/api/watched/${encodeURIComponent(tmdbId)}`));
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Nem sikerült ellenőrizni a megnézéseket.");
  }

  return {
    watchCount: result.watch_count || 0,
    latestWatch: result.latest_watch || null,
    watches: result.watches || [],
  };
}

export async function removeMovieFromWatchlist(tmdbId) {
  const response = await fetch(getApiUrl(`/api/movies/${encodeURIComponent(tmdbId)}`), {
    method: "DELETE",
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Nem sikerült eltávolítani a filmet.");
  }

  return result;
}

export async function getWatchlistMovies() {
  const response = await fetch(getApiUrl("/api/getmovies"));
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Nem sikerült betölteni a listát.");
  }

  return result.movies || [];
}

export async function isMovieInWatchlist(tmdbId) {
  const response = await fetch(getApiUrl(`/api/movies/${encodeURIComponent(tmdbId)}`));
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Nem sikerült ellenőrizni a listát.");
  }

  return result.in_watchlist;
}

function getApiUrl(path) {
  const isBackendOrigin =
    window.location.hostname === "localhost" && window.location.port === "3001";

  if (isBackendOrigin) {
    return path;
  }

  return `http://localhost:3001${path}`;
}

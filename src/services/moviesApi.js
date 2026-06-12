let watchedMoviesRequest = null;

export async function saveMovieToWatchlist(movie, userStatus = "queued") {
  const moviePayload = toMoviePayload(movie);
  const director =
    movie.director ||
    movie.credits?.crew?.find((person) => person.job === "Director")?.name ||
    null;

  const response = await fetch(getApiUrl("/api/movies"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movie: moviePayload,
      user_status: userStatus,
      director,
      genre_id: moviePayload.genres?.[0]?.id || null,
    }),
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Nem sikerült hozzáadni a filmet.");
  }

  return result.movie;
}

export async function markMovieAsWatched(movie, userVote, watchNotes) {
  const watchedMovie = toMoviePayload(movie);
  const director =
    movie.director ||
    movie.credits?.crew?.find((person) => person.job === "Director")?.name ||
    null;

  const response = await fetch(getApiUrl("/api/watched"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movie: watchedMovie,
      user_vote: userVote,
      watch_notes: watchNotes,
      director,
      genre_id: watchedMovie.genres?.[0]?.id || null,
    }),
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Nem sikerült megnézettként menteni.");
  }

  watchedMoviesRequest = null;

  return result.watched;
}

function toMoviePayload(movie) {
  return {
    id: movie.id,
    title: movie.title,
    backdrop_path: movie.backdrop_path,
    budget: movie.budget,
    genres: movie.genres?.map((genre) => ({
      id: genre.id,
      name: genre.name,
    })),
    original_language: movie.original_language,
    overview: movie.overview,
    popularity: movie.popularity,
    poster_path: movie.poster_path,
    production_companies: movie.production_companies?.map((company) => ({
      name: company.name,
    })),
    release_date: movie.release_date,
    revenue: movie.revenue,
    runtime: movie.runtime,
    status: movie.status,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    user_status: movie.user_status,
  };
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

  watchedMoviesRequest = null;
  return result;
}

export async function removeWatchedMovie(tmdbId) {
  const response = await fetch(getApiUrl(`/api/watched/${encodeURIComponent(tmdbId)}`), {
    method: "DELETE",
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Nem sikerült eltávolítani a megnézett filmet.");
  }

  watchedMoviesRequest = null;
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

export async function getWatchedMovies({ force = false } = {}) {
  if (!watchedMoviesRequest || force) {
    watchedMoviesRequest = fetch(getApiUrl("/api/watched"))
      .then((response) => response.json().then((result) => ({ response, result })))
      .then(({ response, result }) => {
        if (!response.ok || !result.ok) {
          throw new Error(result.error || "Nem sikerült betölteni a megnézett filmeket.");
        }

        return result.movies || [];
      })
      .catch((error) => {
        watchedMoviesRequest = null;
        throw error;
      });
  }

  return watchedMoviesRequest;
}

export async function getRecommendedMovies(limit = 10, offset = 0) {
  const response = await fetch(
    getApiUrl(
      `/api/recommendations?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(
        offset,
      )}`,
    ),
  );
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Nem sikerült betölteni az ajánlásokat.");
  }

  return {
    movies: result.movies || [],
    matchedGenres: result.matched_genres || [],
    offset: result.offset || 0,
  };
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

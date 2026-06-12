import "dotenv/config";
import Database from "better-sqlite3";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const DATABASE_PATH = process.env.DATABASE_PATH || path.join(rootDir, "movies.db");
const db = new Database(DATABASE_PATH);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(rootDir));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

initDatabase();

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tmdb_id TEXT NOT NULL UNIQUE,
      user_vote INTEGER,
      watch_notes TEXT,
      watched_at TEXT,
      status TEXT DEFAULT 'queue',
      director TEXT,
      genres INTEGER
    )
  `);
  db.prepare("UPDATE movies SET status = 'queue' WHERE status = 'want_to_watch'").run();
}

function normalizeStatus(status) {
  return status === "watched" ? "watched" : "queue";
}

function getTmdbId(movie) {
  return movie?.id ? String(movie.id) : "";
}

function getDirectorName(movie, body = {}) {
  return (
    body.director ||
    movie?.director ||
    movie?.credits?.crew?.find((person) => person.job === "Director")?.name ||
    null
  );
}

function getGenreId(movie, body = {}) {
  const bodyGenreId = Number(body.genre_id ?? body.genres);
  const movieGenreId = Number(
    movie?.genres?.find((genre) => Number.isFinite(Number(genre.id)))?.id,
  );

  if (Number.isInteger(bodyGenreId)) return bodyGenreId;
  if (Number.isInteger(movieGenreId)) return movieGenreId;

  return null;
}

function getMovieGenresText(movie) {
  return movie?.genres?.map((genre) => genre.name).filter(Boolean).join(", ") || null;
}

function getProductionCompaniesText(movie) {
  return (
    movie?.production_companies
      ?.map((company) => company.name)
      .filter(Boolean)
      .join(", ") || null
  );
}

function mapMovieDetails(movie) {
  if (!movie?.id) return null;

  return {
    id: movie.id,
    tmdb_id: String(movie.id),
    title: movie.title,
    backdrop_path: movie.backdrop_path,
    budget: movie.budget,
    genres: getMovieGenresText(movie),
    imdb_id: movie.imdb_id || null,
    original_languages: movie.original_language,
    original_language: movie.original_language,
    overview: movie.overview,
    popularity: Math.round(Number(movie.popularity || 0)),
    poster_path: movie.poster_path,
    production_companies: getProductionCompaniesText(movie),
    release_date: movie.release_date,
    revenue: movie.revenue,
    runtime: movie.runtime,
    status: movie.status || "Released",
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
  };
}

async function fetchTmdbMovie(tmdbId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${encodeURIComponent(
      tmdbId,
    )}?api_key=${TMDB_API_KEY}&append_to_response=credits`,
  );

  if (!response.ok) {
    throw new Error(`TMDB movie ${tmdbId} could not be loaded.`);
  }

  return response.json();
}

async function enrichMovieRow(row) {
  const tmdbMovie = await fetchTmdbMovie(row.tmdb_id);
  const movie = mapMovieDetails(tmdbMovie);

  return {
    ...movie,
    watched_id: row.id,
    user_vote: row.user_vote,
    UserVote: row.user_vote,
    watch_notes: row.watch_notes,
    watched_at: row.watched_at,
    user_status: normalizeStatus(row.status),
    director: row.director || getDirectorName(tmdbMovie),
    genre_id: row.genres,
  };
}

async function enrichMovieRows(rows) {
  return Promise.all(rows.map((row) => enrichMovieRow(row)));
}

function getPreferenceGenres() {
  const rows = db
    .prepare(
      `
      SELECT genres
      FROM movies
      WHERE genres IS NOT NULL
        AND status IN ('watched', 'queue')
      `,
    )
    .all();
  const genreScores = new Map();

  rows.forEach((row) => {
    const genreId = Number(row.genres);
    if (!Number.isInteger(genreId)) return;

    genreScores.set(genreId, (genreScores.get(genreId) || 0) + 1);
  });

  return [...genreScores.entries()]
    .sort((firstGenre, secondGenre) => secondGenre[1] - firstGenre[1])
    .map(([genreId, weight]) => ({ genreId, weight }));
}

function getProportionalGenreTargets(preferenceGenres, limit) {
  const totalWeight = preferenceGenres.reduce((sum, genre) => sum + genre.weight, 0);
  if (!totalWeight) return [];

  const targets = preferenceGenres.map((genre) => {
    const exactShare = (genre.weight / totalWeight) * limit;

    return {
      genreId: genre.genreId,
      exactShare,
      target: Math.floor(exactShare),
      remainder: exactShare % 1,
    };
  });

  let remaining = limit - targets.reduce((sum, genre) => sum + genre.target, 0);

  targets
    .filter((genre) => genre.target === 0)
    .sort((firstGenre, secondGenre) => secondGenre.remainder - firstGenre.remainder)
    .slice(0, remaining)
    .forEach((genre) => {
      genre.target += 1;
      remaining -= 1;
    });

  targets
    .sort((firstGenre, secondGenre) => secondGenre.remainder - firstGenre.remainder)
    .slice(0, remaining)
    .forEach((genre) => {
      genre.target += 1;
    });

  return targets
    .filter((genre) => genre.target > 0)
    .sort((firstGenre, secondGenre) => secondGenre.exactShare - firstGenre.exactShare);
}

function getSavedTmdbIds() {
  return new Set(
    db
      .prepare("SELECT tmdb_id FROM movies")
      .all()
      .map((row) => String(row.tmdb_id)),
  );
}

function mapDiscoverMovie(movie, matchedGenreId) {
  return {
    id: movie.id,
    tmdb_id: String(movie.id),
    title: movie.title,
    backdrop_path: movie.backdrop_path,
    genre_id: matchedGenreId,
    genre_ids: movie.genre_ids || [],
    genres: `Genre #${matchedGenreId}`,
    original_language: movie.original_language,
    overview: movie.overview,
    popularity: movie.popularity,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    user_status: "recommendation",
  };
}

async function fetchTmdbDiscoverMovies(genreId, page = 1) {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    with_genres: String(genreId),
    "vote_average.gte": "7",
    "vote_count.gte": "350",
    sort_by: "vote_average.desc",
    include_adult: "false",
    page: String(page),
  });
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`TMDB discover for genre ${genreId} could not be loaded.`);
  }

  const result = await response.json();
  return result.results || [];
}

async function getTopRatedGenreRecommendations(limit = 10, offset = 0) {
  if (!TMDB_API_KEY) {
    throw new Error("Missing TMDB_API_KEY.");
  }

  const startPage = 1 + offset * 3;
  const endPage = startPage + 2;
  const preferenceGenres = getPreferenceGenres();
  const genreTargets = getProportionalGenreTargets(preferenceGenres, limit);
  const savedTmdbIds = getSavedTmdbIds();
  const recommendationsById = new Map();

  for (const { genreId, target } of genreTargets) {
    let genreRecommendationCount = 0;

    for (let page = startPage; page <= endPage; page += 1) {
      const discoveredMovies = await fetchTmdbDiscoverMovies(genreId, page);

      for (const movie of discoveredMovies) {
        const tmdbId = String(movie.id);
        if (savedTmdbIds.has(tmdbId) || recommendationsById.has(tmdbId)) continue;
        if (!movie.title || !movie.poster_path) continue;

        recommendationsById.set(tmdbId, mapDiscoverMovie(movie, genreId));
        genreRecommendationCount += 1;

        if (genreRecommendationCount >= target) break;
      }

      if (genreRecommendationCount >= target || !discoveredMovies.length) break;
    }
  }

  for (const { genreId } of genreTargets) {
    if (recommendationsById.size >= limit) break;

    for (let page = startPage; page <= endPage; page += 1) {
      const discoveredMovies = await fetchTmdbDiscoverMovies(genreId, page);

      for (const movie of discoveredMovies) {
        const tmdbId = String(movie.id);
        if (savedTmdbIds.has(tmdbId) || recommendationsById.has(tmdbId)) continue;
        if (!movie.title || !movie.poster_path) continue;

        recommendationsById.set(tmdbId, mapDiscoverMovie(movie, genreId));
        if (recommendationsById.size >= limit) break;
      }

      if (recommendationsById.size >= limit || !discoveredMovies.length) break;
    }
  }

  const movies = [...recommendationsById.values()]
    .sort((firstMovie, secondMovie) => {
      const ratingDiff =
        Number(secondMovie.vote_average || 0) - Number(firstMovie.vote_average || 0);

      if (ratingDiff !== 0) return ratingDiff;

      return Number(secondMovie.vote_count || 0) - Number(firstMovie.vote_count || 0);
    })
    .slice(0, limit);

  return {
    movies,
    matched_genres: genreTargets.map((genre) => genre.genreId),
    genre_targets: genreTargets,
    offset,
  };
}

function getMovieRow(tmdbId) {
  return db.prepare("SELECT * FROM movies WHERE tmdb_id = ?").get(String(tmdbId));
}

app.get("/api/getmovies", async (req, res) => {
  try {
    const rows = db
      .prepare("SELECT * FROM movies WHERE status = 'queue' ORDER BY id DESC")
      .all();
    const movies = await enrichMovieRows(rows);

    return res.json({
      ok: true,
      movies,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

app.post("/api/movies", async (req, res) => {
  const movie = req.body?.movie;
  const tmdbId = getTmdbId(movie);

  if (!tmdbId) {
    return res.status(400).json({
      ok: false,
      error: "Missing TMDB movie id.",
    });
  }

  const existingMovie = getMovieRow(tmdbId);
  let nextStatus;
  if (req.body?.user_status) {
    nextStatus = normalizeStatus(req.body.user_status);
  } else if (existingMovie) {
    nextStatus = existingMovie.status;
  } else {
    nextStatus = "queue";
  }

  try {
    db.prepare(
      `
      INSERT INTO movies (tmdb_id, status, director, genres)
      VALUES (@tmdb_id, @status, @director, @genres)
      ON CONFLICT(tmdb_id) DO UPDATE SET
        status = @status,
        director = COALESCE(@director, director),
        genres = COALESCE(@genres, genres)
      `,
    ).run({
      tmdb_id: tmdbId,
      status: nextStatus,
      director: getDirectorName(movie, req.body),
      genres: getGenreId(movie, req.body),
    });

    const savedRow = getMovieRow(tmdbId);
    const savedMovie = {
      ...mapMovieDetails(movie),
      watched_id: savedRow.id,
      user_vote: savedRow.user_vote,
      UserVote: savedRow.user_vote,
      watch_notes: savedRow.watch_notes,
      watched_at: savedRow.watched_at,
      user_status: normalizeStatus(savedRow.status),
      director: savedRow.director,
      genre_id: savedRow.genres,
    };

    return res.status(existingMovie ? 200 : 201).json({
      ok: true,
      movie: savedMovie,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

app.get("/api/movies/:tmdbId", (req, res) => {
  const row = getMovieRow(req.params.tmdbId);

  return res.json({
    ok: true,
    in_watchlist: row?.status === "queue",
    watch: row
      ? {
          id: row.id,
          tmdb_id: row.tmdb_id,
          user_status: normalizeStatus(row.status),
        }
      : null,
  });
});

app.get("/api/watched", async (req, res) => {
  try {
    const rows = db
      .prepare("SELECT * FROM movies WHERE status = 'watched' ORDER BY watched_at DESC")
      .all();
    const movies = await enrichMovieRows(rows);

    return res.json({
      ok: true,
      movies,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

app.get("/api/recommendations", async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit || 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 5), 10)
      : 10;
    const requestedOffset = Number(req.query.offset || 0);
    const offset = Number.isFinite(requestedOffset) ? Math.max(0, requestedOffset) : 0;
    const recommendations = await getTopRatedGenreRecommendations(limit, offset);

    return res.json({
      ok: true,
      ...recommendations,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

app.get("/api/watched/:tmdbId", (req, res) => {
  const row = getMovieRow(req.params.tmdbId);
  const isWatched = row?.status === "watched";
  const watch = isWatched
    ? {
        id: row.id,
        tmdb_id: row.tmdb_id,
        UserVote: row.user_vote,
        user_vote: row.user_vote,
        watch_notes: row.watch_notes,
        watched_at: row.watched_at,
        user_status: row.status,
        director: row.director,
        genres: row.genres,
      }
    : null;

  return res.json({
    ok: true,
    watch_count: isWatched ? 1 : 0,
    latest_watch: watch,
    watches: watch ? [watch] : [],
  });
});

app.post("/api/watched", async (req, res) => {
  const movie = req.body?.movie;
  const tmdbId = getTmdbId(movie);
  const userVote = Number(req.body?.user_vote || 0);

  if (!tmdbId) {
    return res.status(400).json({
      ok: false,
      error: "Missing TMDB movie id.",
    });
  }

  if (userVote < 1 || userVote > 10) {
    return res.status(400).json({
      ok: false,
      error: "Add a rating between 1 and 10.",
    });
  }

  try {
    const watchedAt = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO movies (
        tmdb_id,
        user_vote,
        watch_notes,
        watched_at,
        status,
        director,
        genres
      )
      VALUES (
        @tmdb_id,
        @user_vote,
        @watch_notes,
        @watched_at,
        'watched',
        @director,
        @genres
      )
      ON CONFLICT(tmdb_id) DO UPDATE SET
        user_vote = @user_vote,
        watch_notes = @watch_notes,
        watched_at = @watched_at,
        status = 'watched',
        director = COALESCE(@director, director),
        genres = COALESCE(@genres, genres)
      `,
    ).run({
      tmdb_id: tmdbId,
      user_vote: userVote,
      watch_notes: req.body?.watch_notes || null,
      watched_at: watchedAt,
      director: getDirectorName(movie, req.body),
      genres: getGenreId(movie, req.body),
    });

    const savedRow = getMovieRow(tmdbId);

    return res.status(200).json({
      ok: true,
      watched: {
        id: savedRow.id,
        tmdb_id: savedRow.tmdb_id,
        UserVote: savedRow.user_vote,
        user_vote: savedRow.user_vote,
        watch_notes: savedRow.watch_notes,
        watched_at: savedRow.watched_at,
        user_status: savedRow.status,
        director: savedRow.director,
        genres: savedRow.genres,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

app.delete("/api/movies/:tmdbId", (req, res) => {
  const result = db
    .prepare("DELETE FROM movies WHERE tmdb_id = ?")
    .run(String(req.params.tmdbId));

  return res.json({
    ok: true,
    deleted: result.changes,
    tmdb_id: String(req.params.tmdbId),
  });
});

app.delete("/api/watched/:tmdbId", (req, res) => {
  const result = db
    .prepare("DELETE FROM movies WHERE tmdb_id = ? AND status = 'watched'")
    .run(String(req.params.tmdbId));

  return res.json({
    ok: true,
    deleted: result.changes,
    tmdb_id: String(req.params.tmdbId),
  });
});

app.get("/api/status", async (req, res) => {
  res.json({
    app: "movie-dashboard-api",
    database: DATABASE_PATH,
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

const server = app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
server.ref();

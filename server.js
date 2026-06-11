import "dotenv/config";
import Database from "better-sqlite3";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;
const TMDB_API_KEY = process.env.TMDB_API_KEY || "c6455f4bc87edf27444b6349f528c1b6";
const db = new Database("movies.db");

app.use(express.json({ limit: "1mb" }));
app.use(express.static("."));

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
  const nextStatus =
    existingMovie?.status === "watched"
      ? "watched"
      : normalizeStatus(req.body?.user_status);

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
    .prepare("DELETE FROM movies WHERE tmdb_id = ? AND status = 'queue'")
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
    database: "movies.db",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

const server = app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
server.ref();

import express from "express";
import { supabase } from "./supabaseClient.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
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

app.get("/api/getmovies", async (req, res) => {
  const { data, error } = await supabase
    .from("UserWatchData")
    .select(`
      tmdb_id,
      user_status,
      MovieData (
        id,
        tmdb_id,
        title,
        backdrop_path,
        budget,
        genres,
        imdb_id,
        original_languages,
        overview,
        popularity,
        poster_path,
        production_companies,
        release_date,
        revenue,
        runtime,
        status,
        vote_average,
        vote_count
      )
    `)
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }

  return res.json({
    ok: true,
    movies: (data ?? [])
      .map((row) => ({
        ...row.MovieData,
        user_status: row.user_status,
      }))
      .filter((movie) => movie?.tmdb_id),
  });
});

app.post("/api/movies", async (req, res) => {
  const movie = req.body?.movie;

  if (!movie?.id || !movie?.title) {
    return res.status(400).json({
      ok: false,
      error: "Missing movie details.",
    });
  }

  const tmdbId = String(movie.id);

  const movieRow = {
    id: movie.id,
    tmdb_id: tmdbId,
    title: movie.title,
    backdrop_path: movie.backdrop_path,
    budget: movie.budget,
    genres: movie.genres?.map((genre) => genre.name).join(", ") || null,
    imdb_id: null,
    original_languages: movie.original_language,
    overview: movie.overview,
    popularity: Math.round(Number(movie.popularity || 0)),
    poster_path: movie.poster_path,
    production_companies:
      movie.production_companies?.map((company) => company.name).join(", ") ||
      null,
    release_date: movie.release_date,
    revenue: movie.revenue,
    runtime: movie.runtime,
    status: movie.status || "Released",
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
  };

  const { data: savedMovie, error: movieError } = await supabase
    .from("MovieData")
    .upsert(movieRow, { onConflict: "id" })
    .select()
    .single();

  if (movieError) {
    return res.status(500).json({
      ok: false,
      error: movieError.message,
    });
  }

  const { data: existingWatchRows, error: watchLookupError } = await supabase
    .from("UserWatchData")
    .select("id")
    .eq("tmdb_id", tmdbId)
    .limit(1);

  if (watchLookupError) {
    return res.status(500).json({
      ok: false,
      error: watchLookupError.message,
    });
  }

  const existingWatchRow = existingWatchRows?.[0];
  const watchRow = {
    tmdb_id: tmdbId,
    user_status: req.body?.user_status || "queued",
  };

  const watchQuery = existingWatchRow
    ? supabase
        .from("UserWatchData")
        .update(watchRow)
        .eq("id", existingWatchRow.id)
        .select()
        .single()
    : supabase.from("UserWatchData").insert(watchRow).select().single();

  const { data: savedWatchRow, error: watchError } = await watchQuery;

  if (watchError) {
    return res.status(500).json({
      ok: false,
      error: watchError.message,
    });
  }

  return res.status(201).json({
    ok: true,
    movie: {
      ...savedMovie,
      user_status: savedWatchRow.user_status,
    },
  });
});

app.get("/api/movies/:tmdbId", async (req, res) => {
  const tmdbId = String(req.params.tmdbId);

  const { data, error } = await supabase
    .from("UserWatchData")
    .select("id, tmdb_id, user_status")
    .eq("tmdb_id", tmdbId)
    .maybeSingle();

  if (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }

  return res.json({
    ok: true,
    in_watchlist: Boolean(data),
    watch: data,
  });
});

app.get("/api/watched", async (req, res) => {
  const { data, error } = await supabase
    .from("Watched")
    .select(`
      id,
      tmdb_id,
      UserVote,
      watch_notes,
      watched_at,
      MovieData (
        id,
        tmdb_id,
        title,
        backdrop_path,
        budget,
        genres,
        imdb_id,
        original_languages,
        overview,
        popularity,
        poster_path,
        production_companies,
        release_date,
        revenue,
        runtime,
        status,
        vote_average,
        vote_count
      )
    `)
    .order("watched_at", { ascending: false });

  if (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }

  return res.json({
    ok: true,
    movies: (data ?? [])
      .map((row) => ({
        ...row.MovieData,
        watched_id: row.id,
        user_vote: row.UserVote,
        watch_notes: row.watch_notes,
        watched_at: row.watched_at,
      }))
      .filter((movie) => movie?.tmdb_id),
  });
});

app.get("/api/watched/:tmdbId", async (req, res) => {
  const tmdbId = String(req.params.tmdbId);

  const { data, error } = await supabase
    .from("Watched")
    .select("id, tmdb_id, UserVote, watch_notes, watched_at")
    .eq("tmdb_id", tmdbId)
    .order("watched_at", { ascending: false });

  if (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }

  return res.json({
    ok: true,
    watch_count: data?.length || 0,
    latest_watch: data?.[0] || null,
    watches: data || [],
  });
});

app.post("/api/watched", async (req, res) => {
  const movie = req.body?.movie;
  const tmdbId = movie?.id ? String(movie.id) : "";
  const userVote = Number(req.body?.user_vote || 0);

  if (!movie?.id || !movie?.title) {
    return res.status(400).json({
      ok: false,
      error: "Missing movie details.",
    });
  }

  if (userVote < 1 || userVote > 10) {
    return res.status(400).json({
      ok: false,
      error: "Add a rating between 1 and 10.",
    });
  }

  const movieRow = {
    id: movie.id,
    tmdb_id: tmdbId,
    title: movie.title,
    backdrop_path: movie.backdrop_path,
    budget: movie.budget,
    genres: movie.genres?.map((genre) => genre.name).join(", ") || null,
    imdb_id: null,
    original_languages: movie.original_language,
    overview: movie.overview,
    popularity: Math.round(Number(movie.popularity || 0)),
    poster_path: movie.poster_path,
    production_companies:
      movie.production_companies?.map((company) => company.name).join(", ") ||
      null,
    release_date: movie.release_date,
    revenue: movie.revenue,
    runtime: movie.runtime,
    status: movie.status || "Released",
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
  };

  const { error: movieError } = await supabase
    .from("MovieData")
    .upsert(movieRow, { onConflict: "id" });

  if (movieError) {
    return res.status(500).json({
      ok: false,
      error: movieError.message,
    });
  }

  const watchedRow = {
    tmdb_id: tmdbId,
    UserVote: userVote,
    watch_notes: req.body?.watch_notes || null,
    watched_at: new Date().toISOString(),
  };
  const { data: savedWatchedRow, error: watchedError } = await supabase
    .from("Watched")
    .insert(watchedRow)
    .select()
    .single();

  if (watchedError) {
    return res.status(500).json({
      ok: false,
      error: watchedError.message,
    });
  }

  const { error: watchlistError } = await supabase
    .from("UserWatchData")
    .delete()
    .eq("tmdb_id", tmdbId);

  if (watchlistError) {
    return res.status(500).json({
      ok: false,
      error: watchlistError.message,
    });
  }

  return res.status(201).json({
    ok: true,
    watched: savedWatchedRow,
  });
});

app.delete("/api/movies/:tmdbId", async (req, res) => {
  const tmdbId = String(req.params.tmdbId);

  const { error } = await supabase
    .from("UserWatchData")
    .delete()
    .eq("tmdb_id", tmdbId);

  if (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }

  return res.json({
    ok: true,
    tmdb_id: tmdbId,
  });
});

app.get("/api/status", async (req, res) => {
  res.json({
    app: "movie-dashboard-api",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

const server = app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
server.ref();

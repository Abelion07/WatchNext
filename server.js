import express from "express";
import { supabase } from "./supabaseClient.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.get("/api/movies", async (req, res) => {
  const { data, error } = await supabase
    .from("MovieData")
    .select(`
      id,
      tmdb_id,
      title,
      backdrop_path,
      budget,
      genres,
      imdb_id,
      original_languages,
      overview, popularity, 
      poster_path, production_companies, release_date, revenue, runtime, status, vote_average, vote_count
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
    movies: data ?? [],
  });
});

app.get("/api/status", async (req, res) => {
  res.json({
    app: "movie-dashboard-api",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
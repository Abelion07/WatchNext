const TMDB_API_KEY = "c6455f4bc87edf27444b6349f528c1b6";

export async function searchMovies(query) {
  const searchResponse = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`
  );

  if (!searchResponse.ok) {
    throw new Error("Could not search movies.");
  }

  const searchData = await searchResponse.json();
  return searchData.results ?? [];
}

export async function getMovieDetails(movieId) {
  const detailResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`
  );

  if (!detailResponse.ok) {
    throw new Error("Could not load movie details.");
  }

  return detailResponse.json();
}

export async function searchMovie(query) {
  const searchData = await searchMovies(query);
  const movieId = searchData[0]?.id;

  if (!movieId) return null;

  return getMovieDetails(movieId);
}

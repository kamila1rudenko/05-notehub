import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const options = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
};

interface MovieSearchResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieSearchResponse> => {
  const response = await axios.get<MovieSearchResponse>(BASE_URL, {
    params: { query, page },
    ...options,
  });

  return response.data;
};

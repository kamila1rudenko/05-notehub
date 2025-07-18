import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import Pagination from "../Pagination/Pagination";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;
  const movies = data?.results ?? [];

  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast("No results found");
    }
  }, [isSuccess, movies]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  const closeModal = () => setSelectedMovie(null);

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />

      {isSuccess && totalPages > 1 && (
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && isSuccess && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

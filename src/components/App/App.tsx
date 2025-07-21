import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedValue } from "@mantine/hooks";
import css from "./App.module.css";

import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Loading from "../Loading/Loading";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import {
  fetchNotes,
  type FetchNotesResponse,
} from "../../services/noteService";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const queryOptions = {
    queryKey: ["notes", page, debouncedSearch] as const,
    queryFn: () => fetchNotes(page, 12, debouncedSearch),
    staleTime: 3000,
    keepPreviousData: true,
    placeholderData: (): FetchNotesResponse | undefined =>
      queryClient.getQueryData(["notes", page, debouncedSearch]) as
        | FetchNotesResponse
        | undefined,
  };

  const { data, isLoading, isFetching, error } = useQuery(queryOptions);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleNoteCreated = () => {
    setPage(1);
    closeModal();
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {(isLoading || isFetching) && <Loading />}
      {error && <ErrorMessage message={error.message} />}

      {!isLoading && !error && (
        <>
          {data?.notes?.length ? (
            <NoteList notes={data.notes} />
          ) : (
            <p>No notes found.</p>
          )}
        </>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={handleNoteCreated} />
        </Modal>
      )}
    </div>
  );
}

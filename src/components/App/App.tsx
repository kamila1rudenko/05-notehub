import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 300);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, 10, debouncedSearch),
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {data?.meta?.total && data.meta.total > 10 && (
          <Pagination
            pageCount={Math.ceil(data.meta.total / 10)}
            onPageChange={(page) => setPage(page)}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {error && (
        <p style={{ color: "red" }}>Error: {(error as Error).message}</p>
      )}

      {Array.isArray(data?.data) && data.data.length > 0 ? (
        <NoteList notes={data.data} />
      ) : (
        !isLoading && <p>No notes found.</p>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSubmit={closeModal} />
        </Modal>
      )}
    </div>
  );
}

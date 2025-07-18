import css from "./SearchBar.module.css";
import toast from "react-hot-toast";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  async function action(formData: FormData) {
    const query = formData.get("query")?.toString().trim() || "";
    if (!query) {
      toast.error("Please enter your search query.");
      return;
    }
    onSubmit(query);
  }

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form className={css.form} action={action}>
          <input
            className={css.input}
            type="text"
            name="query"
            placeholder="Search movies..."
            autoComplete="off"
          />

          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

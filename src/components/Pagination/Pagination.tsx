import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pageCount,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousClassName={css.prev}
      nextClassName={css.next}
      disabledClassName={css.disabled}
    />
  );
}

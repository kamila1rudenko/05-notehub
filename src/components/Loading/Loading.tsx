import css from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={css.loading}>
      <span className={css.spinner}></span>
      <span className={css.loadingText}>Loading...</span>
    </div>
  );
}

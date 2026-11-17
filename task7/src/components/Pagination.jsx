import Icon from "./Icon";

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="btn btn-outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <Icon name="arrow-left" />
        Prev
      </button>
      <span className="num">
        Page {page} of {totalPages}
      </span>
      <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
        <Icon name="arrow-right" />
      </button>
    </nav>
  );
}

export default Pagination;

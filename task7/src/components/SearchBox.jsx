import Icon from "./Icon";

// The main search field: icon + input + primary action in one container.
function SearchBox({ value, onChange, onSubmit, size = "md", inputId }) {
  return (
    <form className={`search-box search-box-${size}`} onSubmit={onSubmit} role="search">
      <label className="sr-only" htmlFor={inputId}>Search movies by title</label>
      <Icon name="search" className="search-box-icon" />
      <input
        id={inputId}
        type="search"
        placeholder="Search movies"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="btn" type="submit">Search</button>
    </form>
  );
}

export default SearchBox;

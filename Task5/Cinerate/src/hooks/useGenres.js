import { useEffect, useState } from "react";
import { getGenres } from "../services/service";

function useGenres() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres()
      .then((data) => setGenres(data.genres))
      .catch(() => setGenres([]));
  }, []);

  return genres;
}

export default useGenres;

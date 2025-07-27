import axios from "axios"
import type { Movie } from "../types/movie"

interface FetchMoviesResp {
  hits: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
    
    const myKey = import.meta.env.VITE_TMDB_TOKEN;
  
    const response = await axios.get<FetchMoviesResp>(`https://api.themoviedb.org/3/search/movie?query=${query}`, {
        params: {},
        headers: { Authorization: `Bearer ${myKey}`, },
    });
    return response.data.hits;
};

import axios from "axios"
import type { Movie } from "../types/movie"

interface FetchMoviesResp {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (query: string, page: number): Promise<FetchMoviesResp> => {
    
    const myKey = import.meta.env.VITE_TMDB_TOKEN;
  
    const response = await axios.get<FetchMoviesResp>(`https://api.themoviedb.org/3/search/movie?query=${query}`, {
        params: { query: query, page, },
        headers: { Authorization: `Bearer ${myKey}`, },
    });
    return response.data;
};

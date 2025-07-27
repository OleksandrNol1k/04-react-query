import css from "./App.module.css"
import type {Movie} from "../../types/movie"
import toast from "react-hot-toast"
import { Toaster } from "react-hot-toast"
import { useState } from "react"
import { fetchMovies } from "../../servises/movieService"
import SearchBar from "../SearchBar/SearchBar"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import Loader from "../Loader/Loader"
import MovieGrid from "../MovieGrid/MovieGrid"
import MovieModal from "../MovieModal/MovieModal"

export default function App() { 

    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = async (query: string) => {
        
        try {
            setMovies([]);
            setIsLoading(true);
            setIsError(false);
            setSelectedMovie(null);

            const newMovies = await fetchMovies(query);

            if (newMovies.length === 0) {
                toast("No movies found for your request.");
            }
            setMovies(newMovies);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelect = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setSelectedMovie(null);
        setIsModalOpen(false);
    }

    return (
        <div className={css.app}>
            <SearchBar onSubmit={handleSearch} />
            <Toaster />
            {isLoading && <Loader />}
            {isError && <ErrorMessage />}
            {movies.length > 0 && <MovieGrid onSelect={handleSelect} movies={movies} />}
            {selectedMovie && isModalOpen && <MovieModal movie={selectedMovie} onClose={closeModal} />}
        </div>
    );
}
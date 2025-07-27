import css from "./App.module.css"
import type {Movie} from "../../types/movie"
import toast from "react-hot-toast"
import { Toaster } from "react-hot-toast"
import { useEffect, useState } from "react"
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchMovies } from "../../services/movieService"
import SearchBar from "../SearchBar/SearchBar"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import Loader from "../Loader/Loader"
import MovieGrid from "../MovieGrid/MovieGrid"
import MovieModal from "../MovieModal/MovieModal"
import ReactPaginate from 'react-paginate'

export default function App() { 

    // const [movies, setMovies] = useState<Movie[]>([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [isError, setIsError] = useState(false);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["movies", query, page],
        queryFn: () => fetchMovies(query, page),
        enabled: query !== "",
        placeholderData: keepPreviousData,
    })

    const totalPages = data?.total_pages ?? 0;

    useEffect(() => {
        if (data?.results.length === 0) {
            toast("No movies found for your request.");
        }
    }, [isSuccess, data])

    const handleSearch = (newQuery: string) => {
        setQuery(newQuery);
        setPage(1);
        setSelectedMovie(null);
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
            {isSuccess && totalPages > 1 && <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"/>}
            <Toaster />
            {isLoading && <Loader />}
            {isError && <ErrorMessage />}
            {data && data.results.length > 0 && <MovieGrid onSelect={handleSelect} movies={data.results} />}
            {selectedMovie && isModalOpen && <MovieModal movie={selectedMovie} onClose={closeModal} />}
        </div>
    );
}
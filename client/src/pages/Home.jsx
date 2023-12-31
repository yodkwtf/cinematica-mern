import React, { useEffect, useState } from "react";
import MovieDetails from "../components/MovieDetails";
import MovieForm from "../components/MovieForm";
import Filter from "../components/Filter";
import Modal from "../components/Modal";
import useMoviesContext from "../hooks/useMoviesContext";
import useAuthContext from "../hooks/useAuthContext";
import Loader from "../components/Loader";

const Home = () => {
    const { movies, fetchMovies, isLoading } = useMoviesContext();
    const { user } = useAuthContext();

    const [sortedBy, setSortedBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [filteredMovies, setFilterMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchMovies();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        // Update filteredMovies when movies are fetched
        setFilterMovies(movies);
    }, [movies]);

    const handleSortChange = (e) => {
        const selectedSort = e.target.value;
        setSortOrder((prevOrder) => (selectedSort === sortedBy ? (prevOrder === "asc" ? "desc" : "asc") : "asc"));
        setSortedBy(selectedSort);
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    const handleFilterButtonClick = () => {
        setFilterModalOpen(true);
    };

    const handleFilterModalClose = () => {
        setFilterModalOpen(false);
    };

    const handleApplyFilter = (filterValues) => {
        const filteredMovies =
            movies &&
            movies.filter((movie) => {
                return (
                    (!filterValues.genre || movie.genre.toLowerCase().includes(filterValues.genre.toLowerCase())) &&
                    (!filterValues.releaseYear || movie.releaseYear === parseInt(filterValues.releaseYear, 10)) &&
                    (!filterValues.rating || movie.rating === parseInt(filterValues.rating, 10))
                );
            });
        setFilterMovies(filteredMovies);
        console.log("Filtered Movies:", filteredMovies);
    };

    const handleSearch = (e) => {
        const searchedTerm = e.target.value.toLowerCase();
        setSearchTerm(searchedTerm);

        const searchedMovies =
            movies &&
            movies.filter((movie) => {
                return !searchedTerm || movie.name.toLowerCase().includes(searchedTerm);
            });

        if (searchedMovies.length > 0) {
            e.target.style.border = "1px solid #ddd"; // Reset the border color if there are matching movies
        } else {
            e.target.style.border = searchedTerm ? "1px solid red" : "1px solid #ddd"; // Red border if no matching movies and a search term exists
        }

        setFilterMovies(searchedMovies);
        console.log("Searched Movies:", searchedMovies);
    };

    const sortedMovies = (filteredMovies && filteredMovies.length > 0 ? filteredMovies : []).sort((a, b) => {
        if (sortedBy === "name") {
            return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortedBy === "releaseYear") {
            return sortOrder === "asc" ? a.releaseYear - b.releaseYear : b.releaseYear - a.releaseYear;
        } else if (sortedBy === "rating") {
            return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
        } else if (sortedBy === "runtime") {
            return sortOrder === "asc" ? a.runtime - b.runtime : b.runtime - a.runtime;
        }
        // Add more cases if needed for other sorting options
        return 0;
    });

    return (
        <main className="home">
            <div className="content-block">
                <div className="controls">
                    <label>
                        Sort By:
                        <select onChange={handleSortChange} value={sortedBy}>
                            <option value="">-- Select --</option>
                            <option value="name">Name</option>
                            <option value="releaseYear">Release Year</option>
                            <option value="runtime">Runtime</option>
                            <option value="rating">Rating</option>
                        </select>
                        {sortedBy && (
                            <button className="sort-order" onClick={toggleSortOrder}>
                                {sortOrder === "asc" ? "🔼" : "🔽"}
                            </button>
                        )}{" "}
                    </label>
                    <button className="filter-button" onClick={handleFilterButtonClick}>
                        Filter
                    </button>

                    <label>
                        <input type="text" placeholder="Search..." onChange={handleSearch} value={searchTerm} />
                    </label>

                    <Modal isOpen={isFilterModalOpen} onClose={handleFilterModalClose}>
                        <Filter onClose={handleFilterModalClose} onApplyFilter={handleApplyFilter} />
                    </Modal>
                </div>

                {sortedMovies.length > 0 ? (
                    <div className="movies">
                        {sortedMovies.map((movie) => (
                            <MovieDetails key={movie._id} movie={movie} />
                        ))}
                    </div>
                ) : isLoading ? (
                    <Loader />
                ) : (
                    <p>No movies found...</p>
                )}
            </div>

            <div className="form-block">
                <MovieForm />
            </div>
        </main>
    );
};

export default Home;

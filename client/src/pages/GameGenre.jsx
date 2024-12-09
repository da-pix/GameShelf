import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GameCard from "./GameCard"
import './css/Profile.css';


const Genre = () => {
    const { genreName } = useParams();
    const [genre, setGenre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudio = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/Genre/${genreName.replace(/\s+/g, '__')}`);
                const { genreData, gameData } = res.data;
                setGenre(genreData);
                setGames(gameData)
            } catch (err) {
                setError(err.response?.data?.error || 'Error fetching genre');
            } finally {
                setLoading(false);
            }
        };
        fetchStudio();
    }, [genreName]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="profile-page">
            <h1>{genre.Genre_name}</h1>
            <p>{genre.Genre_description}</p>
            <strong>Games made: </strong>
            <div className="game-wide-container">
                {games.length > 0 ? (
                    games.map((game) => <GameCard key={game.Game_ID} game={game} />)
                ) : (
                    <p>No games found.</p>
                )}
            </div>
        </div>
    );
};

export default Genre;

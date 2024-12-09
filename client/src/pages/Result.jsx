import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GameCard from "./GameCard"

const Result = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8800/find-games?query=${encodeURIComponent(query)}`);
        setGames(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="results-container">
      <h1>Results for "{query}"</h1>
      {games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <div className="game-wide-container">
          {
            games.map((game) => <GameCard key={game.Game_ID} game={game} />)
          }
        </div>
      )}
    </div>
  );
};

export default Result;
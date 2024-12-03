import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './css/landing.css';
import GameCard from "./GameCard"
import PlatformCard from "./PlatformCard"

const Landing = () => {
  const [games, setGames] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopGames = async () => {
      try {
        const res = await axios.get("http://localhost:8800/landing-info");
        const { gameData, platData } = res.data;
        setGames(gameData);
        setPlatforms(platData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopGames();
  }, []);

  return (
    <div className="landing-container">
      <div className='display-platforms'>
        {platforms.length > 0 ? (
          platforms.map((platform) => <PlatformCard key={platform.Platform_ID} platform={platform} />)
        ) : (
          <p>No games found.</p>
        )}
      </div>
      <h1> Top Rated Games </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="display-Games">
          {games.length > 0 ? (
            games.map((game) => <GameCard key={game.Game_ID} game={game} />)
          ) : (
            <p>No games found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Landing
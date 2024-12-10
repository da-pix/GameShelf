import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios'
import './css/landing.css';
import GameCard from "./GameCard"
import PlatformCard from "./PlatformCard"

const Landing = () => { 
  const [games, setGames] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

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

  // Handle the "Request a Game" button click
  const handleRequestGame = () => {
    const logged = !!user;
    if (!logged) {
    } else {
    }
  };

  return (
    <div className="landing-container">
      <div className='display-platforms'>
        {platforms.length > 0 ? (
          platforms.map((platform) => <PlatformCard key={platform.Platform_ID} platform={platform} />)
        ) : (
          <p>No games found.</p>
        )}
      </div>
      <img className="shelf-img" id="shelf" src="/icons/shelf_elem.png" alt="Shelf Icon" />
      <h1> Top 10 Rated Games </h1>
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
      <button onClick={handleRequestGame} className="request-game-button">
        Request a Game
      </button>
    </div>
  );
};

export default Landing;

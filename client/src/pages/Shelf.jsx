import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './css/Profile.css';
import GameCard from "./GameCard";

const Shelf = () => {
  const { username } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const ownsPage = user && user.username === username.replace(/__/g, ' ');

  const fetchShelf = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/shelf/${username.replace(/\s+/g, '__')}`);
      setGames(res.data);
    } catch (err) {
      const errorStatus = err.response?.status;
      if (errorStatus === 500) {
        setError('Database error');
      } else if (errorStatus === 404) {
        setError('User not found');
      } else {
        setError(err.response?.data?.error || 'Error fetching shelf items');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelf();
  }, [username]);

  const handleUser = (username) => {
    navigate(`/Profile/${username.replace(/\s+/g, '__')}`);
  };

  const handleRemoveGame = async (Game_ID) => {
    try {
      const res = await axios.post('http://localhost:8800/remove-from-shelf', {
        Shelf_ID: user.shelfID,
        User_ID: user.userID,
        Game_ID
      });
      fetchShelf();
    } catch (err) {
      console.log(err.response?.data?.error || 'Error removing game from shelf');
    }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 onClick={(e) => { handleUser(username); }}>{username.replace(/__/g, ' ')}'s Game Shelf</h1>
      </div>
      <div className="game-wide-container">
        {games.length > 0 ? (
          games.map((game) => <GameCard
            key={game.Game_ID}
            game={game}
            editable={ownsPage}
            onRemove={handleRemoveGame}
          />)
        ) : (
          <p>No games in shelf</p>
        )}
      </div>
    </div>
  );
};

export default Shelf;

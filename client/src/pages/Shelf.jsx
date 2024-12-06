import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './css/Profile.css';
import GameCard from "./GameCard"

const Shelf = () => {
  const { username } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const ownsPage = user && user.username === username.replace(/__/g, ' ');

  useEffect(() => {
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
    fetchShelf();
  }, [username]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div className="profile-page">
      <div className="profile-header">
        <img className="profile-image" alt="Profile Icon" />
        <h1>{username.replace(/__/g, ' ')}'s Game Shelf</h1>
      </div>
      <div className="display-Games">
        {games.length > 0 ? (
          games.map((game) => <GameCard
            key={game.Game_ID}
            game={game}
            editable={ownsPage}
          />)
        ) : (
          <p>No games in shelf</p>
        )}
      </div>
    </div>
  );
};

export default Shelf;

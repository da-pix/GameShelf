import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './css/Wishlist.css';
import GameCard from "./GameCard";

const Wishlist = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/wishlist/${user.userID}`);
      setGames(res.data);
    } catch (err) {
      const errorStatus = err.response?.status;
      if (errorStatus === 500) {
        setError('Database error');
      } else if (errorStatus === 404) {
        setError('No wishlist found');
      } else {
        setError(err.response?.data?.error || 'Error fetching wishlist items');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const handleRemoveFromWishlist = async (Game_ID) => {
    try {
      await axios.post('http://localhost:8800/remove-from-wishlist', {
        User_ID: user.userID,
        Game_ID,
      });
      fetchWishlist(); // Refresh the wishlist
    } catch (err) {
      console.error(err.response?.data?.error || 'Error removing game from wishlist');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>Wish Listed Games</h1>
      </div>
      <div className="game-wide-container">
        {games.length > 0 ? (
          games.map((game) => (
            <GameCard
              key={game.Game_ID}
              game={game}
              editable={true} // Allow editing/removal
              onRemove={handleRemoveFromWishlist}
            />
          ))
        ) : (
          <p>No games in wishlist</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

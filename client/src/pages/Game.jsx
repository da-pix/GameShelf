import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import PlatformCard from "./PlatformCard"
import axios from 'axios';
import './css/Game.css';


const Game = () => {
  const { gameTitle } = useParams();
  const [game, setGame] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const [addToShelfMessage, setAddToShelfMessage] = useState('');
  const [inShelf, setInShelf] = useState(false);
  const logged = !!user;

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const User_ID = user ? user.userID : 0;
        const res = await axios.get(`http://localhost:8800/game/${gameTitle.replace(/\s+/g, '__')}`, {
          params: { User_ID }
        });
        const { game, platformData, isInShelf } = res.data;
        setGame(game);
        setPlatforms(platformData)
        setInShelf(isInShelf)
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching game');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
    if (inShelf) setAddToShelfMessage('Game is already in your shelf');
  }, [gameTitle, inShelf]);

  const handleAddToShelf = async () => {
    try {
      const res = await axios.post('http://localhost:8800/add-to-shelf', {
        Shelf_ID: user.shelfID,
        User_ID: user.userID,
        Game_ID: game.Game_ID,
        hours: 0, //******** */
      });
      setAddToShelfMessage('Game added to shelf!');
      setInShelf(true);
    } catch (err) {
      setAddToShelfMessage(err.response?.data?.error || 'Error adding game to shelf');
    }
  };

  const handleRemoveFromShelf = async () => {
    try {
      const res = await axios.post('http://localhost:8800/remove-from-shelf', {
        Shelf_ID: user.shelfID,
        User_ID: user.userID,
        Game_ID: game.Game_ID,
      });
      setAddToShelfMessage('Game removed from shelf!');
      setInShelf(false);
    } catch (err) {
      setAddToShelfMessage(err.response?.data?.error || 'Error removing game from shelf');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleDev = (gameTitle) => {
    navigate(`/game_studio/${gameTitle.replace(/\s+/g, '__')}`);
  };

  return (
    <div className="profile-page">
      <div>
        <img
          className="med-image"
          src={`/images/${game.Coverart_fp || 'Default_image.png'}`}
          alt={`${game.Title} cover art`}
        />
        <h1>{game.Title}</h1>
      </div>
      {inShelf ? (
        <div className='already-div'>
          <button className="rmvButton" onClick={handleRemoveFromShelf}>Remove from Shelf</button>
        </div>
      ) : (
        <button className="addButton" onClick={logged ? handleAddToShelf : () => navigate(`/login`)}>Add to Shelf</button>
      )}
      {addToShelfMessage && <p>{addToShelfMessage}</p>}
      <div className='game-info'>
        <span className="rating">{game.Overall_rating}</span>
        <h3 className="clickable" onClick={() => handleDev(game.Studio_name)}>Developer: {game.Studio_name}</h3>
        <h3>Publisher: {game.Producer}</h3>
        <p>
          <strong>Release Date: </strong>
          {game.Release_date
            ? new Date(game.Release_date).toLocaleDateString()
            : 'NA'}
        </p>
        <p>{game.Description || 'No information available'}</p>
      </div>
      <strong>Playable On: </strong>
      <div className="platform-container">
        {platforms.length > 0 ? (
          platforms.map((platform) => <PlatformCard key={platform.Platform_ID} platform={platform} />)
        ) : (
          <p>No platform found</p>
        )}
      </div>
    </div>
  );
};

export default Game;

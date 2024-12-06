import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import PlatformCard from "./PlatformCard"
import axios from 'axios';
import './css/Game.css';
import ReactStars from 'react-rating-stars-component';


const Game = () => {
  // Variables for game collection
  const { gameTitle } = useParams();
  const [game, setGame] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const [addToShelfMessage, setAddToShelfMessage] = useState('');
  const [inShelf, setInShelf] = useState(false);

  // Variables for reviews
  const [reviews, setReviews] = useState([]);
  const [reviewMessage, setReviewMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewError, setReviewError] = useState('');

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/get_reviews`, {
          params: {
            Game_ID: game.Game_ID,
            User_ID: user.userID,
          }
        });
        const { reviewData, userReview } = res.data;
        setReviews(reviewData);
      } catch (err) {
        setReviewError(err.response?.data?.error || 'Error fetching reviews');
      }
    };
    if (game) fetchReviews();
  }, [game]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleDev = (gameTitle) => {
    navigate(`/game_studio/${gameTitle.replace(/\s+/g, '__')}`);
  };

  const handleReviewSubmit = async () => {
    if (!logged) {
      navigate('/login');
      return;
    }

    if (!rating || !reviewMessage.trim()) {
      setReviewError('Please provide a rating and a review message.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:8800/review`, {
        Game_ID: game.Game_ID,
        User_ID: user.userID,
        Rating: rating,
        ReviewMessage: reviewMessage,
      });
      setReviews([...reviews, res.data]); // Add new review to the list
      setRating(0);
      setReviewMessage('');
      setReviewError('');
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Error submitting review');
    }
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
      <div className='Review_container'>
        <h2>Reviews</h2>

        {/* Review submission form */}
        <div className="review-form">
          <h3>Leave a Review</h3>
          <div className='stars'>
            <ReactStars
              count={5}
              value={rating}
              onChange={(newRating) => setRating(newRating)}
              size={45}
              activeColor="#ffd700"
            /></div>
          <textarea className='review_textbox'
            value={reviewMessage}
            onChange={(e) => setReviewMessage(e.target.value)}
            placeholder="Write your review here..."
          />
          <button onClick={handleReviewSubmit}>Submit Review</button>
          {reviewError && <p className="error-message">{reviewError}</p>}
        </div>
        {/* Display existing reviews */}
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.Review_ID} className="review-item">
                <ReactStars
                  count={5}
                  value={review.Rating}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                />
                <p><strong>{review.UserName}:</strong> {review.ReviewMessage}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to leave one!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;

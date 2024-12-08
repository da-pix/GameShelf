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
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const [addToShelfMessage, setAddToShelfMessage] = useState('');
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const [inShelf, setInShelf] = useState(false);
  const [favorited, setFavorited] = useState(false);

  // Variables for reviews
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setreviewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewError, setReviewError] = useState('');
  const [myReview, setMyReview] = useState();
  const [reviewed, setReviewed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);


  const logged = !!user;

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const User_ID = user ? user.userID : 0;
        const res = await axios.get(`http://localhost:8800/game/${gameTitle.replace(/\s+/g, '__')}`, {
          params: { User_ID }
        });
        const { game, platformData, genreData, isInShelf } = res.data;
        setGame(game);
        setPlatforms(platformData)
        setGenres(genreData)
        setInShelf(isInShelf)
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching game');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameTitle, inShelf]);

  const handleAddToShelf = async () => {
    try {
      const res = await axios.post('http://localhost:8800/add-to-shelf', {
        Shelf_ID: user.shelfID,
        User_ID: user.userID,
        Game_ID: game.Game_ID,
        hours: 0, //******** */
      });
      setAddToShelfMessage('Game added to shelf');
      setTimeout(() => setAddToShelfMessage(''), 2000);
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
        Game_ID: game.Game_ID
      });
      setAddToShelfMessage('Game removed from shelf!');
      setTimeout(() => setAddToShelfMessage(''), 2000);
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
            User_ID: logged ? user.userID : null
          }
        });
        const { reviewData, userReview } = res.data;
        setReviews(reviewData);
        setMyReview(userReview);
        if (userReview && (userReview.Rating || userReview.Comment))
          setReviewed(true);
      } catch (err) {
        setReviewError(err.response?.data?.error || 'Error fetching reviews');
      }
    };

    if (game) fetchReviews();
  }, [game, logged]);

  const handleDev = (gameTitle) => {
    navigate(`/game_studio/${gameTitle.replace(/\s+/g, '__')}`);
  };

  const handleUser = (username) => {
    navigate(`/Profile/${username.replace(/\s+/g, '__')}`);
  };

  const handleReviewSubmit = async () => {
    if (!logged) {
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please leave a comment for your review');
      return;
    }
    if (!rating) {
      setReviewError('Please give the game a rating');
      return;
    }
    try {
      const res = await axios.post(`http://localhost:8800/submitReview`, {
        Game_ID: game.Game_ID,
        User_ID: user.userID,
        Rating: rating,
        Comment: reviewComment,
      });
      window.location.reload();
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Error submitting review');
    }
  };

  const handleEditReview = async () => {
    try {
      await axios.put(`/reviews/${myReview.Review_ID}`, myReview);
      setIsEditing(false); // Exit editing mode*************************************************************
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Error saving review');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-page">
      <div className='game-card'>
        <img
          className="med-image"
          src={`/images/${game.Coverart_fp || 'Default_image.png'}`}
          alt={`${game.Title} cover art`}
        />
        <div className='game-sidebar'>
          <div className='title'>
            <h1 >{game.Title}</h1>
          </div>
          <div className='buttons-and-rating'>
            <div className='buttons-container'>
              <div className='shelf-buttons'>
                {inShelf ? (
                  <button className="rmvButton" onClick={handleRemoveFromShelf}>
                    Remove from Shelf
                  </button>

                ) : (
                  <button
                    className="addButton"
                    onClick={logged ? handleAddToShelf : () => navigate(`/login`)}>
                    Add to Shelf
                  </button>
                )}
                <p>{addToShelfMessage}</p>
              </div>
              <div className='fav-button'>
                {favorited ? (
                  <button className="rmvButton" onClick={handleRemoveFromShelf}>
                    Favorite
                  </button>

                ) : (
                  <button
                    className="addButton"
                    onClick={logged ? handleAddToShelf : () => navigate(`/login`)}>
                    Unfavorite
                  </button>
                )}
                <p>{favoriteMessage}</p>
              </div>
            </div>
            <span className="rating">{game.Overall_rating}</span>

          </div>
          <div className="game-info">
            <div className='creds-and-date'>
              <h3
                className="clickable"
                onClick={() => handleDev(game.Studio_name)}
              >
                Developer: {game.Studio_name}
              </h3>
              <h3>Publisher: {game.Producer}</h3>
              <p>
                <strong>Release Date: </strong>
                {game.Release_date
                  ? new Date(game.Release_date).toLocaleDateString()
                  : 'NA'}
              </p>
            </div>
          </div>
          <p>{game.Description || 'No information available'}</p>
        </div>
      </div>

      <strong>Playable On: </strong>
      <div className="platform-container">
        {platforms.length > 0 ? (
          platforms.map((platform) => (
            <PlatformCard key={platform.Platform_ID} platform={platform} />
          ))
        ) : (
          <p>No platform found</p>
        )}
      </div>
      <div className="Review_container">
        <h2>Reviews</h2>
        {/* Review form or user's review */}
        {reviewed ? (
          <div className="my-review">
            <h3>Your Review</h3>
            <div className="stars">
              <ReactStars
                count={5}
                value={myReview.Rating}
                size={45}
                edit={false}
                activeColor="#ffd700"
              />
            </div>
            <textarea
              className="review_textbox"
              value={myReview.Comment}
              readOnly={!isEditing}
              onChange={(e) =>
                setMyReview({ ...myReview, Comment: e.target.value })
              }
            />
            <div>
              {isEditing ? (
                <button className="form-button" onClick={handleEditReview}>Save</button>
              ) : (
                <button className="form-button" onClick={() => setIsEditing(true)}>Edit</button>
              )}
            </div>
            {reviewError && <p className="error-message">{reviewError}</p>}
          </div>
        ) : (
          <div className="review-form">
            <h3>Leave a Review</h3>
            <div className="stars">
              <ReactStars
                count={5}
                value={rating}
                onChange={(newRating) => setRating(newRating)}
                size={45}
                activeColor="#ffd700"
              />
            </div>
            <textarea
              className="review_textbox"
              value={reviewComment}
              onChange={(e) => setreviewComment(e.target.value)}
              placeholder="Write your review here..."
            />
            <button lassName="form-button" onClick={handleReviewSubmit}>Submit Review</button>
            {reviewError && <p className="error-message">{reviewError}</p>}
          </div>
        )}
        {/* Display existing reviews */}
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review" key={review.Review_ID}>
                <div className="review-top">
                  <h2
                    onClick={(e) => { handleUser(review.User_username); }}>
                    {review.User_username}</h2>
                  <div className='review-stars'>
                    <ReactStars
                      count={5}
                      value={review.Rating}
                      size={30}
                      edit={false}
                      activeColor="#ffd700"
                    />
                  </div>
                </div>
                <p>{review.Comment}</p>
              </div>
            ))
          ) : !reviewed ? (
            <p>No reviews yet. Feel free to leave one!</p>
          ) : <p>No other reviews yet</p>}
        </div>
      </div>
    </div>
  )
};

export default Game;

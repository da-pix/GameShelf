import React from "react";
import { useNavigate } from 'react-router-dom';
import "./css/App.css";
import ReactStars from 'react-rating-stars-component';


const GameCard = ({ game, editable, onRemove }) => {
  const navigate = useNavigate();

  // game click funcionality
  const handleGame = (gameTitle) => {
    navigate(`/game/${gameTitle.replace(/\s+/g, '__')}`);
  };

  const handleDev = (gameTitle) => {
    navigate(`/game_studio/${gameTitle.replace(/\s+/g, '__')}`);
  };

  return (
    <div className="game" onClick={() => handleGame(game.Title)} key={game.Game_ID}>
      <img
        className="small-image"
        src={`/images/${game.Coverart_fp || 'Default_image.png'}`}
        alt={`${game.Title} cover art`}
      />
      <div className="game-content">
        <div className="gametop">
          <h2>{game.Title}</h2>
          {editable && (
            <button className="rmvButton" onClick={(e) => {
              e.stopPropagation();
              onRemove(game.Game_ID);
            }}> X</button>
          )}
        </div>
        <div className="rating">
          <ReactStars
            count={5}
            value={game.Overall_rating}
            size={20}
            edit={false}
            activeColor="#ffd700"
          />
        </div>
        <div className="gamebottom">
          <div className="game-makers">
            <h3
              className="clickable"
              onClick={(e) => {
                e.stopPropagation();
                handleDev(game.Studio_name);
              }}>Developer: {game.Studio_name}</h3>
            <h3>Publisher: {game.Producer}</h3>
          </div>
          <p>
            <strong>Release Date: </strong>
            {game.Release_date
              ? new Date(game.Release_date).toLocaleDateString()
              : 'NA'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameCard;

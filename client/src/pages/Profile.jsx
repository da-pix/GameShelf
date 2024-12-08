import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './css/Profile.css';
import GameCard from "./GameCard"

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const ownsPage = user && user.username === username.replace(/__/g, ' ');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/profile/${username.replace(/\s+/g, '__')}`);
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Shelf button funcionality
  const handleShelf = () => {
    navigate(`/shelf/${username.replace(/\s+/g, '__')}`);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>{username.replace(/__/g, ' ')}'s Profile</h1>
      </div>
      <div>
        {profile.favGame !== null ? (
          <div className="fav-Game">
            <p className="Game-title">
              {username.replace(/__/g, ' ')}'s favorite game
            </p>
            <GameCard key={profile.favGame.Game_ID} game={profile.favGame} />
          </div>
        ) : (
          <p className="fav-Game-title">Havent found their favourite yet!</p>
        )}
      </div>
      <button className="to-Shelf" onClick={handleShelf}>Check out Game Shelf</button>
      {ownsPage && (
        <div className="shelf-actions">
          <p className='clickable'>Edit profile</p>
        </div>
      )}
    </div>
  );
};

export default Profile;

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './css/Profile.css';
import GameCard from './GameCard';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const ownsPage = user && user.username === username.replace(/__/g, ' ');

  // Fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/profile/${username.replace(/\s+/g, '__')}`
        );
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (!user || ownsPage) return;
    const checkFollowStatus = async () => {
      try {
        const res = await axios.get('http://localhost:8800/is-following', { params: { username, currentUserID: user.userID } });
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error('Error checking follow status:', err);
      }
    };

    checkFollowStatus();
  }, [user, username, ownsPage]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.post('http://localhost:8800/unfollow', { currentUserID: user.userID, username });
        setIsFollowing(false);
      } else {
        await axios.post('http://localhost:8800/follow', { currentUserID: user.userID, username });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Error updating follow status:', err);
    }
  };

  const handleBanUser = async () => {
    if (!user || !user.isAdmin) return;
    const confirmBan = window.confirm(`Are you sure you want to delete ${username.replace(/__/g, ' ')}'s account? This action cannot be undone.`);
    if (!confirmBan) return;

    try {
      await axios.post('http://localhost:8800/ban-user', {
        adminID: user.userID,
        userID: profile.User_ID,
      });
      alert(`${username.replace(/__/g, ' ')}'s account has been deleted.`);
      navigate('/'); // Redirect after banning
    } catch (err) {
      alert(err.response?.data || 'Error deleting user.');
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Shelf button functionality
  const handleShelf = () => {
    navigate(`/shelf/${username.replace(/\s+/g, '__')}`);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>{username.replace(/__/g, ' ')}'s Profile</h1>
        {!ownsPage && user && (
          <div className="action-buttons">
            <button className="follow-button" onClick={handleFollowToggle}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            {user.isAdmin && (
              <button className="ban-button" onClick={handleBanUser}>
                Ban User
              </button>
            )}
          </div>
        )}
      </div>
      <div>
        {profile.favGame !== null ? (
          <div className="fav-Game">
            <p className="Game-title">
              {username.replace(/__/g, ' ')}'s favorite game:
            </p>
            <GameCard key={profile.favGame.Game_ID} game={profile.favGame} />
          </div>
        ) : (
          <p className="fav-Game-title">Haven't found their favorite yet!</p>
        )}
      </div>
      <button className="to-Shelf" onClick={handleShelf}>
        Check out Game Shelf
      </button>
    </div>
  );
};

export default Profile;

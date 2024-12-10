import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import './css/TopBar.css';

const TopBar = () => {
    const { user, setUser } = useContext(UserContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [follwoingMenuOpen, setFollwoingMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('view');
    const [following, setFollowing] = useState([]);
    const [searchResults, setSearchResults] = useState('');
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');


    // Logout button funcionality
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setMenuOpen(false);
        navigate('/');
    };

    // Fetch following list
    useEffect(() => {
        if (follwoingMenuOpen && activeTab === 'view' && user) {
            const fetchFollowing = async () => {
                try {
                    const res = await axios.get('http://localhost:8800/following', { params: { userID: user.userID } });
                    setFollowing(res.data);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchFollowing();
        }
    }, [follwoingMenuOpen, activeTab, user]);

    // Handle user search
    const handleUserSearch = async () => {
        if (!userSearchQuery.trim()) return;
        try {
            const res = await axios.get('http://localhost:8800/find-user', { params: { username: userSearchQuery } });
            setSearchResults(res.data);
            console.log(res.data);

        } catch (err) {
            console.error(err);
        }
    };

    const handleUser = (username) => {
        navigate(`/Profile/${username.replace(/\s+/g, '__')}`);
        setFollwoingMenuOpen(false);
    };

    // Login button funcionality
    const handleLogin = () => {
        setMenuOpen(false);
        navigate('/login');
    };

    // profile button funcionality
    const handleProfile = () => {
        setMenuOpen(false);
        navigate(`/profile/${user.username.replace(/\s+/g, '__')}`);
    };

    // Shelf button funcionality
    const handleShelf = () => {
        navigate(`/shelf/${user.username.replace(/\s+/g, '__')}`);
    };

    const handleRandGame = async () => {
        try {
            const res = await axios.get("http://localhost:8800/rand-game");
            const gameName = res.data;
            navigate(`/game/${gameName.replace(/\s+/g, '__')}`);
        } catch (err) {
            console.error(err);
        }
    };

    // Shelf button funcionality
    const handleAdminTools = () => {
        navigate(`/AdminTools/`);
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    // Close the menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest('.profile-container')) {
                setMenuOpen(false);
            }
            if (follwoingMenuOpen && !event.target.closest('.friends-popup') && !event.target.closest('#friends-icon')) {
                setFollwoingMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpen, follwoingMenuOpen]);


    const handleSearch = () => {
        if (!searchQuery.trim()) {
            return; // Don't search for empty input
        }
        navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <div className="top-bar">
            <div className="top-left-div">
                <Link to="/">
                    <h1>Game Shelf</h1>
                </Link>
                <img className="icon" onClick={handleRandGame} id="feeling-lucky-icon" src="/icons/dice.png" alt="Feeling lucky Icon" />
                {(!!user && user.isAdmin) ?
                    (<img className="icon" onClick={handleAdminTools} id="Admin-tools" src="/icons/gear.png" alt="Admin tools" />): (<></>)}
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Search</button>
            </div>
            <div className="top-right-div">
                <img
                    className="icon"
                    id="friends-icon"
                    src="/icons/friends.png"
                    alt="Friends Icon"
                    onClick={() => setFollwoingMenuOpen(!follwoingMenuOpen)}
                />
                {follwoingMenuOpen && (
                    <div className="friends-popup">
                        <div className="popup-header">
                            <button
                                className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
                                onClick={() => setActiveTab('view')}
                            >
                                View
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'find' ? 'active' : ''}`}
                                onClick={() => setActiveTab('find')}
                            >
                                Find
                            </button>
                        </div>
                        <div className="popup-content">
                            {activeTab === 'view' && (
                                <div className="view-tab">
                                    <h3>Following</h3>
                                    {following.length > 0 ? (
                                        <ul>
                                            {following.map((user) => (
                                                <div className='User-listing' onClick={(e) => { handleUser(user.User_username); }}>
                                                    <li key={user.User_ID}>{user.User_username}</li>
                                                </div>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>You are not following anyone yet.</p>
                                    )}
                                </div>
                            )}
                            {activeTab === 'find' && (
                                <div className="find-tab">
                                    <div className='find-tab-top'>
                                        <input
                                            type="text"
                                            placeholder="Search for user"
                                            value={userSearchQuery}
                                            onChange={(e) => setUserSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                                        />
                                        <button onClick={handleUserSearch}>Search</button>
                                    </div>
                                    {searchResults ? (
                                        <div className='User-listing' onClick={(e) => { handleUser(searchResults.User_username); }}>
                                            <p>{searchResults.User_username}</p>
                                        </div>
                                    ) : (
                                        <p>No users found.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <img className="icon" id="shelf-icon" src="/icons/shelf.png" alt="Shelf Icon" onClick={handleShelf} />
                <div className="profile-container">
                    <img
                        className="icon"
                        id="profile-icon"
                        src="/icons/profile-user.png"
                        alt="Profile Icon"
                        onClick={toggleMenu}
                    />
                    <p>{user ? `${user.username}` : ''}</p>
                    {menuOpen && (
                        <div className="profile-menu">
                            {!user ? (
                                <div onClick={handleLogin}>Log In</div>
                            ) : (
                                <>
                                    <div onClick={handleProfile}>Profile</div>
                                    <div onClick={handleLogout}>Log Out</div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default TopBar;
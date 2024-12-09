import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import './css/TopBar.css';

const TopBar = () => {
    const { user, setUser } = useContext(UserContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Logout button funcionality
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setMenuOpen(false);
        navigate('/');
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
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpen]);


    return (
        <div className="top-bar">
            <div className="top-left-div">
                <Link to="/">
                    <h1>Game Shelf</h1>
                </Link>
                <img className="icon" onClick={handleRandGame} id="feeling-lucky-icon" src="/icons/dice.png" alt="Feeling lucky Icon" />
                {(!!user && user.isAdmin) &&
                    (<img className="icon" onClick={handleAdminTools} id="Admin-tools" src="/icons/gear.png" alt="Admin tools" />)}
            </div>
            <div className="top-right-div">
                <img className="icon" id="friends-icon" src="/icons/friends.png" alt="Friends Icon" />
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
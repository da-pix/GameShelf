import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GameCard from "./GameCard"
import './css/Profile.css';


const Platform = () => {
    const { platformName } = useParams();
    const [platform, setPlatform] = useState(null);
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlatform = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/Platform/${platformName.replace(/\s+/g, '__')}`);
                const { platformData, gameData } = res.data;
                setPlatform(platformData);
                setGames(gameData)
            } catch (err) {
                setError(err.response?.data?.error || 'Error fetching game');
            } finally {
                setLoading(false);
            }
        };
        fetchPlatform();
    }, [platformName]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="profile-page">
            <img className="large-platform-icon" src={`/platform/${platform.Plat_icon_fp}`} alt={`${platform.Platform_name} cover art`} />
            <h1>{platform.Platform_name}</h1>
            <strong>Games playable on this platform:</strong>
            <div className="game-wide-container">
                {games.length > 0 ? (
                    games.map((game) => <GameCard key={game.Game_ID} game={game} />)
                ) : (
                    <p>No games found.</p>
                )}
            </div>

        </div>
    );

};

export default Platform;
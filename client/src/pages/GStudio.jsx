import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GameCard from "./GameCard"
import './css/Profile.css';


const GStudio = () => {
    const { studioName } = useParams();
    const [studio, setStudio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudio = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/game_studio/${studioName.replace(/\s+/g, '__')}`);
                const { studioData, gameData } = res.data;
                setStudio(studioData);
                setGames(gameData)
            } catch (err) {
                setError(err.response?.data?.error || 'Error fetching game');
            } finally {
                setLoading(false);
            }
        };
        fetchStudio();
    }, [studioName]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="profile-page">

            {studio.Studio_icon_fp ? (
                <img className="med-image" src={`/studio/${studio.Studio_icon_fp}`} alt={`${studio.Studio_name}'s icon`} />
            ) : (
                <div className="placeholder-image">No Image</div>
            )}
            <h1>{studio.Studio_name}</h1>
            <strong>Games made: </strong>
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

export default GStudio;

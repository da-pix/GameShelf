import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './css/Profile.css';
import './css/AdminTools.css';


const AdminTools = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Review Game Requests');
    const { user } = useContext(UserContext);
    const [requests, setRequests] = useState([]);
    const [studioName, setStudioName] = useState('');
    const [genreName, setGenreName] = useState('');
    const [genreDesc, setGenreDesc] = useState('');
    const [studioIcon, setStudioIcon] = useState('');
    const [gameImage, setGameImage] = useState('');
    const [platformIcon, setPlatformIcon] = useState('');
    const [studioSuccessMessage, setStudioSuccessMessage] = useState('');
    const [platSuccessMessage, setPlatSuccessMessage] = useState('');
    const [genreSuccessMessage, setgenreSuccessMessage] = useState('');
    const [gameTitle, setGameTitle] = useState('');
    const [platformName, setPlatformName] = useState('');
    const [producer, setProducer] = useState('');
    const [gameDescription, setGameDescription] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [platReleaseDate, setPlatReleaseDate] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [selectedStudio, setSelectedStudio] = useState(null);
    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [studios, setStudios] = useState([]);

    const navigate = useNavigate();
    const logged = !!user;


    const fetchSubmissions = async () => {
        try {
            const res = await axios.get('http://localhost:8800/AdminTools/submissions');
            setRequests(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching user submissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!logged || !user.isAdmin) {
            navigate('/login');
            return;
        }
        fetchSubmissions();
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const genreRes = await axios.get('http://localhost:8800/AllGenres');
            const platformRes = await axios.get('http://localhost:8800/AllPlatforms');
            const studioRes = await axios.get('http://localhost:8800/AllStudios');
            setGenres(genreRes.data);
            setPlatforms(platformRes.data);
            setStudios(studioRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };
    const handleAddStudio = async (e) => {
        e.preventDefault();
        if (!studioName) {
            alert('Please fill studio name');
            return;
        }
        const formData = new FormData();
        formData.append('studioName', studioName);
        formData.append('studioIcon', studioIcon);
        try {
            const res = await axios.post('http://localhost:8800/AdminTools/add-studio', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setStudioSuccessMessage("Game studio added successfully");
            setStudioName('');
            setStudioIcon('');
            setTimeout(() => setStudioSuccessMessage(''), 2000);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to add studio. Please try again.');
        }
    };

    const handleAddPlatform = async (e) => {
        e.preventDefault();
        if (!platformName || !platReleaseDate || !platformIcon) {
            alert('Please fill all fields');
            return;
        }
        const formData = new FormData();
        formData.append('platformName', platformName);
        formData.append('releaseDate', platReleaseDate);
        formData.append('platformIcon', platformIcon);
        try {
            const res = await axios.post('http://localhost:8800/AdminTools/add-platform', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setPlatSuccessMessage("Platform added successfully");
            setPlatformName('');
            setPlatReleaseDate('');
            setPlatformIcon('');
            setTimeout(() => setPlatSuccessMessage(''), 2000);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to add platform. Please try again.');
        }
    };

    const handleAddGenre = async (e) => {
        e.preventDefault();
        if (!genreName || !genreDesc) {
            alert('Please fill out all fields.');
            return;
        }
        try {
            const res = await axios.post('http://localhost:8800/AdminTools/add-genre', {
                Genre_name: genreName,
                Genre_description: genreDesc
            });
            setgenreSuccessMessage("Game genre added successfully");
            setGenreName('');
            setGenreDesc('');
            setTimeout(() => setgenreSuccessMessage(''), 2000);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to add studio. Please try again.');
        }
    };

    const handleAddGame = async (e) => {
        e.preventDefault();
        if (!gameTitle || !producer || !gameDescription || !releaseDate || !selectedStudio || !gameImage) {
            alert('Please fill out all fields.');
            return;
        }
        const formData = new FormData();
        formData.append('title', gameTitle);
        formData.append('producer', producer);
        formData.append('description', gameDescription);
        formData.append('releaseDate', releaseDate);
        formData.append('genres', JSON.stringify(selectedGenres));
        formData.append('platforms', JSON.stringify(selectedPlatforms));
        formData.append('studioID', selectedStudio);
        formData.append('gameImage', gameImage);

        try {
            const res = await axios.post('http://localhost:8800/AdminTools/add-game', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Game added successfully!');
            setGameTitle('');
            setProducer('');
            setGameDescription('');
            setReleaseDate('');
            setSelectedGenres([]);
            setSelectedPlatforms([]);
            setSelectedStudio(null);
            setGameImage('');
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert('Failed to add game. Please try again.');
        }
    };

    const handleDeleteRequest = async (requestID) => {
        try {
            await axios.delete(`http://localhost:8800/Del-request/${requestID}`);
            fetchSubmissions();
        } catch (error) {
            console.error('Error deleting request:', error);
            alert('Failed to delete request');
        }
    };

    const handleAddRequest = (gameName, reqID) => {
        setActiveTab('Add Game')
        setGameTitle(gameName);
        handleDeleteRequest(reqID);
    };

    const handleUser = (username) => {
        navigate(`/Profile/${username.replace(/\s+/g, '__')}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const tabs = [
        'Review Game Requests',
        'Add Game',
        'Create Game Genre',
        'Add Studio',
        'Add Platform',
        'Logs'
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Review Game Requests':
                return (
                    <div>
                        {requests.length > 0 ? (
                            requests.map((req) => (
                                <div className="request" key={req.Request_ID}>
                                    <div className="req-top">
                                        <h2 onClick={(e) => { handleUser(req.User_username); }}>User: {req.User_username}</h2>
                                        <h3>Requested game: {req.Title}</h3>
                                        <div className='buttons'>
                                            <button className='delButton' onClick={() => handleDeleteRequest(req.Request_ID)}>x</button>
                                            <button className='approveButton' onClick={() => handleAddRequest(req.Title, req.Request_ID)}>+</button>
                                        </div>
                                    </div>
                                    <strong> Source url: </strong>{req.Source_url}
                                </div>
                            ))
                        ) : (
                            <p>No Pending Requests</p>
                        )}
                    </div>);
            case 'Add Game':
                return (
                    <div>
                        <h2>Add Game</h2>
                        <form onSubmit={handleAddGame} type="centred">
                            <div className="form-group">
                                <label htmlFor="gameTitle">Game Title:</label>
                                <input
                                    type="text"
                                    id="gameTitle"
                                    name="gameTitle"
                                    placeholder="Enter game title"
                                    value={gameTitle}
                                    onChange={(e) => setGameTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="producer">Producer:</label>
                                <input
                                    type="text"
                                    id="producer"
                                    name="producer"
                                    placeholder="Enter producer name"
                                    value={producer}
                                    onChange={(e) => setProducer(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gameDescription">Description:</label>
                                <textarea
                                    id="gameDescription"
                                    name="gameDescription"
                                    placeholder="Describe the game"
                                    value={gameDescription}
                                    onChange={(e) => setGameDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="small-form-group" >
                                <label htmlFor="releaseDate">Release Date:</label>
                                <input
                                    type="date"
                                    id="releaseDate"
                                    name="releaseDate"
                                    value={releaseDate}
                                    onChange={(e) => setReleaseDate(e.target.value)}
                                    required
                                />
                            </div>
                            <label>Genres:</label>
                            <div className="checkbox-group">
                                {genres.map((genre) => (
                                    <div className="cb-option" key={genre.Genre_ID}>
                                        <input
                                            type="checkbox"
                                            id={`genre-${genre.Genre_ID}`}
                                            name="genres"
                                            value={genre.Genre_ID}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedGenres((prev) => [...prev, genre.Genre_ID]);
                                                } else {
                                                    setSelectedGenres((prev) =>
                                                        prev.filter((id) => id !== genre.Genre_ID)
                                                    );
                                                }
                                            }}
                                        />
                                        <label htmlFor={`genre-${genre.Genre_ID}`}>{genre.Genre_name}</label>
                                    </div>
                                ))}
                            </div>
                            <label>Platforms:</label>
                            <div className="checkbox-group">
                                {platforms.map((platform) => (
                                    <div className="cb-option" key={platform.Platform_ID}>
                                        <input
                                            type="checkbox"
                                            id={`platform-${platform.Platform_ID}`}
                                            name="platforms"
                                            value={platform.Platform_ID}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedPlatforms((prev) => [...prev, platform.Platform_ID]);
                                                } else {
                                                    setSelectedPlatforms((prev) =>
                                                        prev.filter((id) => id !== platform.Platform_ID)
                                                    );
                                                }
                                            }}
                                        />
                                        <label htmlFor={`platform-${platform.Platform_ID}`}>{platform.Platform_name}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="form-group">
                                <label htmlFor="studio">Studio:</label>
                                <select
                                    id="studio"
                                    name="studio"
                                    value={selectedStudio || ''}
                                    onChange={(e) => setSelectedStudio(e.target.value)}
                                    required
                                >
                                    <option value="">Select a studio</option>
                                    {studios.map((studio) => (
                                        <option key={studio.Studio_ID} value={studio.Studio_ID}>
                                            {studio.Studio_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="gameImage">Game Image:</label>
                                <input
                                    type="file"
                                    id="gameImage"
                                    name="gameImage"
                                    accept="image/*"
                                    onChange={(e) => setGameImage(e.target.files[0])}
                                    required
                                />
                            </div>
                            <button type="submit">Add Game</button>
                        </form>
                    </div>
                );
            case 'Create Game Genre':
                return (
                    <div>
                        <h2>Create Genre</h2>
                        <form onSubmit={handleAddGenre} type="centred">
                            <div className="form-group">
                                <label htmlFor="genreName">Genre Name:</label>
                                <input
                                    type="text"
                                    id="genreName"
                                    name="genreName"
                                    placeholder="Enter genre name"
                                    value={genreName}
                                    onChange={(e) => setGenreName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="genreDesc">genre Description:</label>
                                <input
                                    type="text"
                                    id="genreDesc"
                                    name="genreDesc"
                                    placeholder="Describe the genre"
                                    value={genreDesc}
                                    onChange={(e) => setGenreDesc(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Create Genre</button>
                        </form>
                        {genreSuccessMessage && <p>{genreSuccessMessage}</p>}
                    </div>
                );
            case 'Add Studio':
                return (
                    <div>
                        <h2>Add Development Studio</h2>
                        <form onSubmit={handleAddStudio} type="centred">
                            <div className="form-group">
                                <label htmlFor="studioName">Studio Name:</label>
                                <input
                                    type="text"
                                    id="studioName"
                                    name="studioName"
                                    placeholder="Enter studio name"
                                    value={studioName}
                                    onChange={(e) => setStudioName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="studioIcon">Studio Icon Image:</label>
                                <input
                                    type="file"
                                    id="studioIcon"
                                    name="studioIcon"
                                    accept="image/*"
                                    onChange={(e) => setStudioIcon(e.target.files[0])}
                                />
                            </div>
                            <button type="submit">Add Studio</button>
                        </form>
                        {studioSuccessMessage && <p>{studioSuccessMessage}</p>}
                    </div>
                );
            case 'Add Platform':
                return (<div>
                    <h2>Add Platform</h2>
                    <form onSubmit={handleAddPlatform} type="centred">
                        <div className="form-group">
                            <label htmlFor="platformName">Platform name:</label>
                            <input
                                type="text"
                                id="platformName"
                                name="platformName"
                                placeholder="Enter platform name"
                                value={platformName}
                                onChange={(e) => setPlatformName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="small-form-group" >
                            <label htmlFor="releaseDate">Release Date:</label>
                            <input
                                type="date"
                                id="releaseDate"
                                name="releaseDate"
                                value={platReleaseDate}
                                onChange={(e) => setPlatReleaseDate(e.target.value)}
                                required
                            />
                        </div> <div className="form-group">
                            <label htmlFor="platformIcon">Platform Icon:</label>
                            <input
                                type="file"
                                id="platformIcon"
                                name="platformIcon"
                                accept="image/*"
                                onChange={(e) => setPlatformIcon(e.target.files[0])}
                                required
                            />
                        </div>
                        <button type="submit">Add Game</button>
                    </form>
                    {platSuccessMessage && <p>{platSuccessMessage}</p>}
                </div>);
            case 'Logs':
                return <p>Content for Logs</p>;
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>Admin Tools</h1>
            </div>
            <div className='admin-tools-container'>
                <div className='left-buttons-bar'>
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`admin-button ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className='page-content'>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminTools;

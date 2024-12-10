import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
app.use(cors());
app.use((req, res, next) => {
  console.log(`Middleware reached: ${req.method} ${req.url}`);
  next();
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "CPSC471pass",
  database: "gameshelf",
});

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const studioIconStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../client/public/studio'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'studio-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const studioIconUpload = multer({ storage: studioIconStorage });

const gameImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../client/public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'game-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const gameImageUpload = multer({ storage: gameImageStorage });

const platformIconStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../client/public/platform'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'platform-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const platIconUpload = multer({ storage: platformIconStorage });

// Test route
app.get("/", (req, res) => {
  res.json("hello this is the backend");
});

// Get all games
app.get("/AllGames", (req, res) => {
  const q = "SELECT * FROM game";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get all genres
app.get("/AllGenres", (req, res) => {
  const q = "SELECT * FROM genre";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get all platforms
app.get("/AllPlatforms", (req, res) => {
  const q = "SELECT * FROM platform";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get all game studios
app.get("/AllStudios", (req, res) => {
  const q = "SELECT * FROM game_studio";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get random game name
app.get("/rand-game", (req, res) => {
  const q = "SELECT game.Title FROM game ORDER BY RAND() LIMIT 1";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).send("No games found.");
    const gameName = data[0].Title
    return res.json(gameName);
  });
});

// Get top rated games as well as 5 random conmsoles to show on the landing page
app.get("/landing-info", (req, res) => {
  // Get the 10 most rated game info
  const gamesQuery = `
  SELECT G.Game_ID, G.Title, G.Producer, G.Coverart_fp, G.Overall_rating, G.Release_date, GS.Studio_ID, GS.Studio_name
  FROM game AS G JOIN game_studio AS GS ON G.Studio_ID = GS.Studio_ID ORDER BY Overall_rating DESC LIMIT 10`;
  db.query(gamesQuery, (err, gameData) => {
    if (err) return res.json(err);
    // Get 5 random platforms
    const platQuery = "SELECT *  FROM platform ORDER BY RAND() LIMIT 5";
    db.query(platQuery, (err, platData) => {
      if (err) return res.json(err);
      return res.status(200).json({ gameData, platData });
    })
  });
});


// Sign-up
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  db.query("SELECT * FROM user WHERE User_username = ?", [username], (err, result) => {
    if (err) {
      return res.status(500).send('Database error.');
    }
    if (result.length > 0) {
      return res.status(400).send('Username is already taken.');
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).send('Error hashing password.');
      }
      // Insert new user into the database
      const insertQuery = 'INSERT INTO user (User_username, User_password) VALUES (?, ?)';
      db.query(insertQuery, [username, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).send('Error creating user.');
        }
        const userID = result.insertId;
        const insertShelfQuery = 'INSERT INTO shelf (User_ID) VALUES (?)';
        db.query(insertShelfQuery, [userID], (err, result) => {
          res.status(201).send('User registered successfully.');
        });
      });
    });
  });
});


// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  //Get user info for comparison from username as well as the user's shelf Id
  const query = `
  SELECT U.User_ID, U.User_username,U.User_password, U.AdminFlag, S.Shelf_ID 
  FROM user AS U JOIN shelf AS S ON U.User_ID = S.User_ID 
  WHERE User_username = ?`;
  db.query(query, [username], (err, result) => {
    if (err || !result.length) {
      return res.status(400).send('User not found.');
    }
    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.User_password);
    if (isMatch) {
      res.status(200).send({ userID: user.User_ID, username: user.User_username, isAdmin: user.AdminFlag, shelfID: user.Shelf_ID });
      console.log("User Logged in:", username);
    } else {
      res.status(400).send('Invalid password');
    }
  });
})

// Check username availability
app.post("/check-username", (req, res) => {
  const { username } = req.body;
  // Check if the username already exists
  db.query("SELECT * FROM user WHERE User_username = ?", [username], (err, results) => {
    if (err) return res.status(500).json("Database error.");
    res.json({ exists: results.length > 0 });
  });
});

// Get user profile and their favourite game by username
app.get('/profile/:username', (req, res) => {
  const urlName = req.params.username;
  const username = urlName.replace(/__/g, ' ');
  // Gets user info and the game info for their favourite game
  const query = `
    SELECT U.User_ID, U.User_username, G.Game_ID, G.Title, G.Producer, G.Coverart_fp, G.Overall_rating, G.Release_date, GS.Studio_ID, GS.Studio_name
    FROM user AS U 
    LEFT JOIN favorite AS F ON U.User_ID = F.User_ID 
    LEFT JOIN game AS G ON G.Game_ID = F.Game_ID 
    LEFT JOIN game_studio AS GS ON G.Studio_ID = GS.Studio_ID
    WHERE U.User_username = ?
  `;
  db.query(query, [username], (err, data) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (data.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = data[0];
    res.status(200).json({
      id: user.User_ID,
      username: user.User_username,
      favGame: user.Game_ID ? user : null,
    });
  });
});

// Get user shelf by username
app.get('/shelf/:username', (req, res) => {
  const urlName = req.params.username;
  const username = urlName.replace(/__/g, ' ');
  // Check if user exists
  const userCheckQuery = 'SELECT User_ID FROM user WHERE User_username = ?';
  db.query(userCheckQuery, [username], (err, userResults) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = userResults[0].User_ID;
    // Get user's shelf games ***************************get number of games
    const shelfQuery = `
      SELECT G.Game_ID, G.Title, G.Producer, G.Coverart_fp, G.Overall_rating, G.Release_date, GS.Hours_played, GST.Studio_ID, GST.Studio_name
      FROM games_in_shelf AS GS
      JOIN game AS G ON GS.Game_ID = G.Game_ID
      JOIN shelf AS S ON S.Shelf_ID = GS.Shelf_ID
      JOIN game_studio AS GST ON G.Studio_ID = GST.Studio_ID
      WHERE S.User_ID = ?
    `;
    db.query(shelfQuery, userId, (err, shelfResults) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.status(200).json(shelfResults);
    });
  });
});


// Get game info for game page by game name as well as checking if a user has the game in their shelf
app.get('/game/:gameTitle', (req, res) => {
  const urlTitle = req.params.gameTitle;
  const ogTitle = urlTitle.replace(/__/g, ' ');
  const userID = req.query.User_ID;
  // Get the game by its unique name
  const gameQuery = `
  SELECT G.Game_ID, G.Title, G.Producer, G.Coverart_fp, G.Overall_rating, G.Release_date, G.Description, GS.Studio_ID, GS.Studio_name
  FROM game AS G 
  JOIN game_studio AS GS ON G.Studio_ID = GS.Studio_ID  
  WHERE G.Title = ?
  `;
  db.query(gameQuery, [ogTitle], (err, gameData) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (gameData.length === 0) return res.status(404).json({ error: 'Game not found' });
    const game = gameData[0];
    // Get data about platforms the game plays on
    const platformQuery = `
      SELECT P.Platform_ID, P.Platform_name, P.Plat_icon_fp, P.Release_date
      FROM platform AS P
      JOIN plays_on AS PO ON P.Platform_ID = PO.Platform_ID
      JOIN game AS G ON G.Game_ID = PO.Game_ID
      WHERE G.Title = ?
    `;
    db.query(platformQuery, [ogTitle], (err, platformData) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!userID) {
        return res.status(200).json({ game, platformData, isInShelf: false });
      }
      // Check if the game is in the user's shelf
      const checkShelfQuery = `
        SELECT S.Shelf_ID
        FROM games_in_shelf AS GS 
        JOIN shelf AS S ON GS.Shelf_ID = S.Shelf_ID
        WHERE S.User_ID = ? AND GS.Game_ID = (SELECT Game_ID FROM game WHERE Title = ?)
      `;
      db.query(checkShelfQuery, [userID, ogTitle], (err, shelfResult) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        const isInShelf = shelfResult.length > 0;
        const gameID = game.Game_ID;
        // Get genres that the game belongs to
        const genreQuery = `
          SELECT G.Genre_name, G.Genre_ID
          FROM genre AS G
          JOIN game_genre AS GG ON G.Genre_ID = GG.Genre_ID
          WHERE GG.Game_ID = ?
        `;
        db.query(genreQuery, [gameID], (err, genreData) => {
          if (err) return res.status(500).json({ error: 'Database error' });

          // Check if the game is in the user's shelf
          const checkFavQuery = `
            SELECT Game_ID
            FROM favorite
            WHERE Game_ID = ? AND User_ID = ?
          `;
          db.query(checkFavQuery, [gameID, userID], (err, favResult) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            const isfavorited = favResult.length > 0;
            return res.status(200).json({ game, platformData, genreData, isInShelf, isfavorited });
          })
        })
      });
    });
  });
});

// Add game to game shelf ***************** ++ num of games in shelf
app.post('/add-to-shelf', async (req, res) => {
  const { Shelf_ID, User_ID, Game_ID, hours } = req.body;
  // Given user id, shelf id and game id, we add the game to a user's shelf
  const addQuery = 'INSERT INTO games_in_shelf (Shelf_ID, User_ID,  Game_ID, Hours_played) VALUES (?, ?, ?, ?)';
  db.query(addQuery, [Shelf_ID, User_ID, Game_ID, hours], (err, result) => {
    if (err)
      return res.status(500).json({ error: 'Error adding game to shelf' });
    res.status(201).json({ message: 'Game added to shelf successfully' });
  });
})

// Remove game from game shelf ***************** -- num of games in shelf
app.post('/remove-from-shelf', async (req, res) => {
  const { Shelf_ID, User_ID, Game_ID } = req.body;
  // Given user id, shelf id and game id, we remove the game from a user's shelf
  const removeQuery = 'DELETE FROM games_in_shelf WHERE Shelf_ID = ? AND User_ID = ? AND Game_ID = ?';
  db.query(removeQuery, [Shelf_ID, User_ID, Game_ID], (err, result) => {
    if (err)
      return res.status(500).json({ error: 'Error adding game to shelf' });
    res.status(201).json({ message: 'Game added to shelf successfully' });
  });
})

// Get studio info by studio name as well as getting every game they have made
app.get('/game_studio/:studioName', (req, res) => {
  const urlName = req.params.studioName;
  const ogName = urlName.replace(/__/g, ' ');
  // Get the studio by its unique name
  const shelfQuery = `SELECT * FROM game_studio AS GS WHERE GS.Studio_name = ?`;
  db.query(shelfQuery, [ogName], (err, studioData) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (studioData.length === 0) return res.status(404).json({ error: 'Studio not found' });
    const studio = studioData[0];
    // Get data about the games this studio has made
    const gameQuery = `
      SELECT G.Game_ID, G.Title, G.Producer, G.Coverart_fp, G.Overall_rating, G.Release_date, GS.Studio_ID, GS.Studio_name
      FROM game AS G
      JOIN game_studio AS GS ON GS.Studio_ID = G.Studio_ID
      WHERE GS.Studio_name = ?
    `;
    db.query(gameQuery, [ogName], (err, gameData) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.status(200).json({ studioData: studio, gameData });
    });
  });
});

// Get platform info by platform name as well as getting every game that is playable on this platform
app.get('/Platform/:platformName', (req, res) => {
  const urlName = req.params.platformName;
  const ogName = urlName.replace(/__/g, ' ');
  // Get the platform by its unique name
  const platformQuery = `SELECT * FROM platform AS P WHERE P.Platform_name = ?`;
  db.query(platformQuery, [ogName], (err, platformData) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (platformData.length === 0) return res.status(404).json({ error: 'platform not found' });
    const platform = platformData[0];
    // Get data about the games that run on this platform
    const gameQuery = `
      SELECT G.Game_ID, G.Title, G.Producer, G.Coverart_fp, G.Overall_rating, G.Release_date, GS.Studio_ID, GS.Studio_name
      FROM game AS G
      JOIN game_studio AS GS ON GS.Studio_ID = G.Studio_ID
      JOIN plays_on AS PO ON G.Game_ID = PO.Game_ID
      JOIN platform AS P ON PO.Platform_ID = P.Platform_ID
      WHERE P.Platform_name = ?
    `;
    db.query(gameQuery, [ogName], (err, gameData) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.status(200).json({ platformData: platform, gameData });
    });
  });
});

// Get game reviews baseded on a games ID
app.get('/get_reviews', (req, res) => {
  const { Game_ID, User_ID } = req.query;
  // Get all reviews except the one posted by the curent user if they are logged in
  const reviewsQuery = `
    SELECT  R.Review_ID, U.User_username, R.Rating, R.Comment
    FROM rates AS RS JOIN review AS R ON RS.Review_ID = R.Review_ID
    JOIN user AS U ON RS.User_ID = U.User_ID
    WHERE RS.Game_ID = ?
    AND (? IS NULL OR RS.User_ID != ?)`;
  db.query(reviewsQuery, [Game_ID, User_ID, User_ID], (err, reviewData) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    // get the review made by current user (if it exists)
    const userReviewQuery = `
      SELECT R.Review_ID, R.Rating, R.Comment
      FROM rates AS RS JOIN review AS R ON RS.Review_ID = R.Review_ID
      WHERE RS.Game_ID = ?
      AND (? IS NOT NULL AND RS.User_ID = ?)`;
    db.query(userReviewQuery, [Game_ID, User_ID, User_ID], (err, userReviewData) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      const userReview = userReviewData[0];
      return res.status(200).json({ reviewData, userReview });
    })
  })
});

// Add a review
app.post('/submitReview', (req, res) => {
  const { Game_ID, User_ID, Rating, Comment } = req.body;
  // Inser the review to the review table
  const submitQuery = 'INSERT INTO review (Comment, Rating) VALUES (?, ?)';
  db.query(submitQuery, [Comment, Rating], (err, result) => {
    if (err) return res.status(500).send('Error submitting review.');
    const review_ID = result.insertId
    // connect the user id,  game id and review id in the rates table
    const ratesQuery = 'INSERT INTO rates (User_ID, Game_ID, Review_ID) VALUES (?, ?, ?)';
    db.query(ratesQuery, [User_ID, Game_ID, review_ID], (err, result) => {
      if (err) return res.status(500).send('Error submitting review.');
    })
  });
});

// Get all existing game request submissions and the user that posted it
app.get('/AdminTools/submissions', (req, res) => {
  // Get all game requests and the username of the user that made it
  const requestsQuery = `
    SELECT  GR.Request_ID, GR.Title, GR.Developer, GR.Source_url, GR.User_ID, U.User_username
    FROM game_request AS GR JOIN user AS U ON GR.User_ID = U.User_ID`;
  db.query(requestsQuery, (err, requestsData) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    return res.status(200).json(requestsData);
  })
});

// Add Created studio
app.post('/AdminTools/add-studio', studioIconUpload.single('studioIcon'), (req, res) => {
  const { studioName } = req.body;
  const studioIcon_fp = req.file ? req.file.filename : null;
  // Adds studio info
  const insertStudioQuery = 'INSERT INTO game_studio (Studio_icon_fp, Studio_name) VALUES (?, ?)';
  db.query(insertStudioQuery, [studioIcon_fp, studioName], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error saving studio to database' });
    }
    res.status(201).send('studio made successfully');
  });
});

// Add Created Platform
app.post('/AdminTools/add-platform', platIconUpload.single('platformIcon'), (req, res) => {
  const { platformName, releaseDate } = req.body;
  const platformIcon_fp = req.file.filename;
  console.log(platformName, releaseDate, platformIcon_fp);
  // Adds studio info
  const insertStudioQuery = 'INSERT INTO platform (Platform_name, Plat_icon_fp, Release_date) VALUES (?, ?, ?)';
  db.query(insertStudioQuery, [platformName, platformIcon_fp, releaseDate], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error saving platform to database' });
    }
    res.status(201).send('platform made successfully');
  });
});

// Add genre
app.post('/AdminTools/add-genre', (req, res) => {
  const { Genre_name, Genre_description } = req.body;
  // Adds genre info
  const insertGenreQuery = 'INSERT INTO genre (Genre_description, Genre_name) VALUES (?, ?)';
  db.query(insertGenreQuery, [Genre_description, Genre_name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error saving genre to database' });
    }
    res.status(201).send('genre made successfully');
  });
});

// Add game and connect it to all its, platforms, genres and its studio
app.post('/AdminTools/add-game', gameImageUpload.single('gameImage'), (req, res) => {
  const { title, producer, description, releaseDate, studioID } = req.body;
  const genres = JSON.parse(req.body.genres);
  const platforms = JSON.parse(req.body.platforms);
  const gameImage_name = req.file.filename;
  // Insert game into database
  const insertGameQuery = `
    INSERT INTO game (Title, Producer, Coverart_fp, Release_date, Studio_ID, Description) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    insertGameQuery,
    [title, producer, gameImage_name, releaseDate, studioID, description],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving game to database' });
      }
      const gameID = result.insertId;
      const genreValues = genres.map((genreID) => [gameID, genreID]);
      const platformValues = platforms.map((platformID) => [gameID, platformID]);
      // Insert game and genres relation
      const insertGenresQuery = 'INSERT INTO game_genre (Game_ID, Genre_ID) VALUES ?';
      // Insert game an platforms relation
      const insertPlatformsQuery = 'INSERT INTO plays_on (Game_ID, Platform_ID) VALUES ?';
      db.query(insertGenresQuery, [genreValues], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error saving game genres' });
        }
        db.query(insertPlatformsQuery, [platformValues], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error saving game platforms' });
          }
          res.status(201).send('Game created successfully');
        });
      });
    });
});

//  Delete request indicated
app.delete('/Del-request/:requestID', (req, res) => {
  const { requestID } = req.params;
  const deleteQuery = 'DELETE FROM game_request WHERE Request_ID = ?';
  db.query(deleteQuery, [requestID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting request' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.status(200).json({ message: 'Request deleted successfully' });
  });
});

// Get genre info by genre name as well as getting every game that belongs to that genre
app.get('/Genre/:genreName', (req, res) => {
  const urlName = req.params.genreName;
  const ogName = urlName.replace(/__/g, ' ');
  // Get the platform by its unique name
  const genreQuery = `SELECT * FROM genre AS G WHERE G.Genre_name = ?`;
  db.query(genreQuery, [ogName], (err, genreData) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (genreData.length === 0) return res.status(404).json({ error: 'platform not found' });
    const genre = genreData[0];
    // Get data about the games that run on this platform
    const gameQuery = `
      SELECT G.Game_ID, G.Title, G.Producer, G.Coverart_fp, G.Overall_rating, G.Release_date, GS.Studio_ID, GS.Studio_name
      FROM game AS G
      JOIN game_studio AS GS ON GS.Studio_ID = G.Studio_ID
      JOIN game_genre AS GG ON G.Game_ID = GG.Game_ID
      JOIN genre AS GE ON GG.Genre_ID = GE.Genre_ID
      WHERE GE.Genre_name = ?
    `;
    db.query(gameQuery, [ogName], (err, gameData) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.status(200).json({ genreData: genre, gameData });
    });
  });
});

// Delete old favorite if exists and make selected game new favorite
app.post('/Favorite', (req, res) => {
  const { User_ID, Game_ID } = req.body;
  // Delete old favorite game
  const DeleteQuery = 'DELETE FROM favorite WHERE User_ID = ?';
  db.query(DeleteQuery, [User_ID], (err, result) => {
    if (err) return res.status(500).send('Error removing old favorite.');
    // Add new game as favorite
    const insertQuery = 'INSERT INTO favorite ( Game_ID, User_ID) VALUES (?, ?)';
    db.query(insertQuery, [Game_ID, User_ID], (err, result) => {
      if (err) return res.status(500).send('Error submitting review.');
      res.status(200).json({ message: 'Game favorited successfully' });
    })
  });
});

// Delete selected game from favorite
app.post('/Unfavorite', (req, res) => {
  const { User_ID, Game_ID } = req.body;
  // Delete favorite game
  const DeleteQuery = 'DELETE FROM favorite WHERE User_ID = ?';
  db.query(DeleteQuery, [User_ID], (err, result) => {
    if (err) return res.status(500).send('Error removing old favorite.');
    res.status(200).json({ message: 'Game unfavorited successfully' });
  });
});

// get a user's people they follow
app.get('/following', async (req, res) => {
  const { userID } = req.query;
  // Get users that given user follows
  const follingQuery = `
    SELECT U.User_username 
    FROM follows AS F JOIN User AS U ON U.User_ID = F.User_ID
    WHERE Followed_by_user_ID = ?`
  db.query(follingQuery, [userID], (err, result) => {
    if (err) return res.status(500).send('Error getting following list.');
    const followingList = result;
    res.json(followingList);
  });
});

// get a user by sarching for their name
app.get('/find-user', async (req, res) => {
  const { username } = req.query;
  // Use user input to get a user by that name
  const follingQuery = `SELECT U.User_username FROM User AS U WHERE U.User_username = ?`
  db.query(follingQuery, [username], (err, result) => {
    if (err) return res.status(500).send('Error getting user.');
    const followingList = result[0];
    res.json(followingList);
  });
});

// Check if a user follows another
app.get('/is-following', (req, res) => {
  const { username, currentUserID } = req.query;
  // return a bool of weather or not thecurrent user follows the profile user
  const followQuery = `
    SELECT 1 
    FROM follows AS F
    JOIN user AS U ON F.User_ID = U.User_ID
    WHERE F.Followed_by_user_ID = ? AND U.User_username = ?
  `;
  db.query(followQuery, [currentUserID, username], (err, result) => {
    if (err) return res.status(500).send('Error checking follow status.');
    res.json({ isFollowing: result.length > 0 });
  });
});

// Follow another user
app.post('/follow', (req, res) => {
  const { currentUserID, username } = req.body;

  const followQuery = `
    INSERT INTO follows (Followed_by_user_ID, User_ID)
    SELECT ?, U.User_ID
    FROM user AS U
    WHERE U.User_username = ?
  `;

  db.query(followQuery, [currentUserID, username], (err, result) => {
    if (err) return res.status(500).send('Error following the user.');
    res.status(200).send('User followed successfully.');
  });
});

// Unfollow user
app.post('/unfollow', (req, res) => {
  const { currentUserID, username } = req.body;

  const unfollowQuery = `
    DELETE F 
    FROM follows AS F
    JOIN user AS U ON F.User_ID = U.User_ID
    WHERE F.Followed_by_user_ID = ? AND U.User_username = ?
  `;

  db.query(unfollowQuery, [currentUserID, username], (err, result) => {
    if (err) return res.status(500).send('Error unfollowing the user.');
    res.status(200).send('User unfollowed successfully.');
  });
});

app.post('/ban-user', (req, res) => {
  const { adminID, userID } = req.body;

  // Check if the requester is an admin
  const checkAdminQuery = `SELECT AdminFlag FROM user WHERE User_ID = ?`;
  db.query(checkAdminQuery, [adminID], (err, result) => {
    if (err || !result.length || !result[0].AdminFlag) {
      return res.status(403).send('Unauthorized action.');
    }

    // Delete user and related data
    const deleteUserQuery = `
      DELETE FROM shelf WHERE User_ID = ?;
      DELETE FROM favorites WHERE User_ID = ?;
      DELETE FROM follows WHERE Follower_ID = ? OR Followed_ID = ?;
      DELETE FROM user WHERE User_ID = ?;
    `;

    db.query(deleteUserQuery, [userID, userID, userID, userID, userID], (err) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).send('Error deleting user.');
      }
      res.status(200).send('User and associated data deleted successfully.');
    });
  });
});



app.get('/find-games', (req, res) => {
  const query = req.query.query;
  const searchQuery = `
      SELECT * FROM game 
      WHERE Title LIKE ?
  `;
  db.query(searchQuery, [`%${query}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No games found' });
    }
    res.status(200).json(results);
  });
});

app.get('/wishlist/:userID', (req, res) => {
  const { userID } = req.params;
  const query = `
    SELECT * FROM wishlist AS W
    JOIN game AS G ON W.Game_ID = G.Game_ID
    WHERE W.User_ID = ?
  `;
  db.query(query, [userID], (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (!results.length) return res.status(404).send('No wishlist found');
    res.status(200).send(results);
  });
});


app.listen(8800, () => {
  console.log("connected to backend!");
});

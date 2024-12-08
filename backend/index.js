import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";


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
  // Get the 20 most rated game info
  const gamesQuery = `
  SELECT G.Game_ID, G.Title, G.Producer, G.Coverart_fp, G.Overall_rating, G.Release_date, GS.Studio_ID, GS.Studio_name
  FROM game AS G JOIN game_studio AS GS ON G.Studio_ID = GS.Studio_ID ORDER BY Overall_rating DESC LIMIT 20`;
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
        res.status(201).send('User registered successfully.');
      });
    });
  });
});


// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  //Get user info for comparison from username as well as the user's shelf Id
  const query = `
  SELECT U.User_ID, U.User_username,U.User_password, S.Shelf_ID 
  FROM user AS U JOIN shelf AS S ON U.User_ID = S.User_ID 
  WHERE User_username = ?`;
  db.query(query, [username], (err, result) => {
    if (err || !result.length) {
      return res.status(400).send('User not found.');
    }
    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.User_password);
    if (isMatch) {
      res.status(200).send({ userID: user.User_ID, username: user.User_username, shelfID: user.Shelf_ID });
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
        const genreQuery = `
          SELECT G.Genre_name
          FROM genre AS G
          JOIN game_genre AS GG ON G.Genre_ID = GG.Genre_ID
          WHERE GG.Game_ID = ?
        `;
        db.query(genreQuery, [gameID], (err, genreData) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          return res.status(200).json({ game, platformData, genreData, isInShelf });
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
  console.log(Game_ID, User_ID, Rating, Comment);

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

app.listen(8800, () => {
  console.log("connected to backend!");
});

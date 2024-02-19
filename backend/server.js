const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const saltRounds = 10;
const fs = require('fs')

const app = express();
const PORT = process.env.PORT || 8081;


app.use(cors({
  origin: 'http://127.0.0.1:5173',
  credentials: true,
}));

app.use(bodyParser.json());

app.use(session({
  secret: 'atharva',
  resave: false,
  saveUninitialized: false,
}));


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'videostreaming',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


app.get('/search', (req, res) => {
  const searchParameter = req.query.q;

  db.query(
    `
    SELECT
      show_table.show_id AS showid,
      show_table.show_name AS title,
      show_table.total_episodes AS total_episodes,
      show_table.show_season AS season,
      show_table.show_ratings AS ratings,
      DATE_FORMAT(show_table.show_date, '%Y-%m-%d') AS date,
      video_table.video_id AS id  
    FROM show_table
    LEFT JOIN video_table ON show_table.show_id = video_table.show_id AND video_table.episode_number = 1
    WHERE show_table.show_name LIKE ?
    LIMIT 4;
  `,
    [`%${searchParameter}%`],
    (error, results) => {
      if (error) {
        console.error('Error executing query:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(searchParameter);
        res.json(results);
      }
    }
  );
});





app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields must be filled' });
  }
  // Check if the username already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password before storing it in the database
    bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error('Error hashing password:', hashErr);
        return res.status(500).json({ success: false, message: 'Registration failed' });
      }

      // Insert the user into the database
      db.query(
        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
        [username, hashedPassword, email],
        (insertErr, insertResults) => {
          if (insertErr) {
            console.error('Error registering user:', insertErr);
            return res.status(500).json({ success: false, message: 'Registration failed' });
          }
          res.status(201).json({ success: true, message: 'Registration successful' });
        }
      );
    });
  });
});


app.post('/login', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields must be filled' });
  }
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.error('Error querying user:', err);
        res.status(500).json({ success: false, message: 'Login failed' });
      } else {
        if (results.length > 0) {
          const match = await bcrypt.compare(password, results[0].password);
          if (match) {
            req.session.isLoggedIn = true;
            req.session.username = results[0].username;
            req.session.email = results[0].email;
            req.session.userid = results[0].userid;
            console.log(req.session.id);
            res.status(200).json({ success: true, message: 'Login successful', email: req.session.email, isLoggedIn: req.session.isLoggedIn, user_id:req.session.userid });
          } else {
            res.status(401).json({ success: false, message: 'Invalid password' });
          }
        } else {
          res.status(404).json({ success: false, message: 'User not found' });
        }
      }
    }
  );
});

app.post('/logout', (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ success: false, message: 'Logout failed' });
    } else {
      res.json({ success: true, message: 'Logout successful' });
    }
  }); 
});


app.get('/cards', (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 12;
  const offset = (page - 1) * pageSize;

  const query = `
  SELECT
  show_table.show_othername AS othername,
  show_table.show_id AS showid,
  show_table.show_name AS title,
  DATE_FORMAT(show_table.show_date, '%Y-%m-%d') AS date,
  show_table.show_description AS summary,
  show_table.show_ratings AS ratings,
  show_table.total_episodes,
  show_table.show_status AS status,
  show_table.show_season AS season,
  video_table.episode_number AS episode,
  video_table.video_id AS videoid,
  video_table.duration,
  GROUP_CONCAT(DISTINCT genre_table.genre_name) AS genres
FROM show_table
JOIN video_table ON show_table.show_id = video_table.show_id
JOIN show_genre_table ON show_table.show_id = show_genre_table.show_id
JOIN genre_table ON show_genre_table.genre_id = genre_table.genre_id
GROUP BY show_table.show_id
ORDER BY video_date
LIMIT ? OFFSET ?;

  `;

  db.query(query, [parseInt(pageSize), parseInt(offset)], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
});

app.get('/new', (req, res) => {
  const query = `
  SELECT 
  show_table.show_name AS title,
  show_table.show_id,
  MIN(video_table.video_id) AS video_id,
  MIN(video_table.episode_number) AS episode,
  show_table.show_season AS season,
  show_table.total_episodes AS TotalEpisodes,
  DATE_FORMAT(show_table.show_date, '%d-%m-%Y') AS Date,
  video_table.video_id AS id
FROM show_table
LEFT JOIN video_table ON show_table.show_id = video_table.show_id AND video_table.episode_number = 1
GROUP BY show_table.show_id
ORDER BY show_table.show_date
LIMIT 5;

`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
});

app.get('/ongoing', (req, res) => {
  const query = `
  SELECT 
  show_table.show_name AS title,
  show_table.show_id,
  MIN(video_table.video_id) AS video_id,
  MIN(video_table.episode_number) AS episode,
  show_table.show_season AS season,
  show_table.total_episodes AS TotalEpisodes,
  DATE_FORMAT(show_table.show_date, '%d-%m-%Y') AS Date,
  video_table.video_id AS id
FROM show_table
LEFT JOIN video_table ON show_table.show_id = video_table.show_id AND video_table.episode_number = 1
GROUP BY show_table.show_id, show_table.show_status
HAVING show_table.show_status = 'ongoing'
ORDER BY show_table.show_status
LIMIT 5;

`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
});

app.get('/completed', (req, res) => {
  const query = `
  SELECT 
  show_table.show_name AS title,
  show_table.show_id,
  MIN(video_table.video_id) AS video_id,
  MIN(video_table.episode_number) AS episode,
  show_table.show_season AS season,
  show_table.total_episodes AS TotalEpisodes,
  DATE_FORMAT(show_table.show_date, '%d-%m-%Y') AS Date,
  video_table.video_id AS id
FROM show_table
LEFT JOIN video_table ON show_table.show_id = video_table.show_id AND video_table.episode_number = 1
GROUP BY show_table.show_id, show_table.show_status
HAVING show_table.show_status = 'completed'
ORDER BY show_table.show_status
LIMIT 5;

`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
});


app.get('/weekly-rank', (req, res) => {
  const query = `
  SELECT
  show_table.show_id AS showid,
  show_table.show_name AS title,
  show_table.total_episodes AS total_episodes,
  show_table.show_season AS season,
  DATE_FORMAT(show_table.show_date, '%Y-%m-%d') as date,
  video_table.video_id AS id
FROM show_table
JOIN weekly_rank ON show_table.show_id = weekly_rank.show_id
LEFT JOIN video_table ON show_table.show_id = video_table.show_id AND video_table.episode_number = 1
ORDER BY weekly_rank.rank
LIMIT 10;

      `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      console.log(results);
      res.status(200).json({ success: true, data: results });
     
    }
  });
});

app.get('/monthly-rank', (req, res) => {
  const query = `
      SELECT
      show_table.show_id AS showid,
      show_table.show_name AS title,
      show_table.total_episodes AS total_episodes,
      show_table.show_season AS season,
      DATE_FORMAT(show_table.show_date, '%Y-%m-%d') as date
  FROM show_table
  JOIN
    monthly_rank ON show_table.show_id = monthly_rank.show_id
  ORDER BY monthly_rank.rank
  LIMIT 10;
      `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.status(200).json({ success: true, data: results });
     
    }
  });
});

app.get('/daily-rank', (req, res) => {
  const query = `
  SELECT
  show_table.show_id AS showid,
  show_table.show_name AS title,
  show_table.total_episodes AS total_episodes,
  show_table.show_season AS season,
  DATE_FORMAT(show_table.show_date, '%Y-%m-%d') as date,
  video_table.video_id AS id
FROM show_table
JOIN daily_rank ON show_table.show_id = daily_rank.show_id
LEFT JOIN video_table ON show_table.show_id = video_table.show_id AND video_table.episode_number = 1
ORDER BY daily_rank.rank
LIMIT 10;

      `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      console.log(results);
      res.status(200).json({ success: true, data: results });
    
    }
  });
}); 

app.post('/cards-filter', (req, res) => {
  try {
    // Access the JSON data from the request body
    const formData = req.body;
    console.log(formData);
    // Construct the base SQL query
    let query = `SELECT
    show_table.show_othername AS othername,
    show_table.show_id AS showid,
    show_table.show_name AS title,
    DATE_FORMAT(show_table.show_date, '%Y-%m-%d') AS date,
    show_table.show_description AS summary,
    show_table.show_ratings AS ratings,
    show_table.total_episodes,
    show_table.show_status AS status,
    show_table.show_season AS season,
    video_table.episode_number AS episode,
    video_table.video_id AS videoid,
    video_table.duration,
    GROUP_CONCAT(DISTINCT genre_table.genre_name) AS genres
  FROM show_table
  JOIN video_table ON show_table.show_id = video_table.show_id
  JOIN show_genre_table ON show_table.show_id = show_genre_table.show_id
  JOIN genre_table ON show_genre_table.genre_id = genre_table.genre_id
  `;

    // Check if the form is not empty
    const hasConditions = Object.keys(formData).some(
      key => (Array.isArray(formData[key]) ? formData[key].length > 0 : formData[key] !== '')
    );

    if (hasConditions) {
      query += ' WHERE';

      // Build the conditions based on non-empty fields
      const conditions = [];

// Iterate through formData properties
for (const key in formData) {
  const value = formData[key];

  // Check if the value is not empty (for arrays, check if length > 0)
  if ((Array.isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
    if (key === 'show_name' && value !== '') {
      // Use LIKE condition for non-empty keyword
      conditions.push(` ${key} LIKE '%${value}%'`);
    } else if (key === 'genre' && Array.isArray(value)) {
      // Use AND (genre_table.genre_name = 'value1' OR genre_table.genre_name = 'value2' OR ...)
      const genreConditions = value.map(genre => ` genre_table.genre_name = '${genre}'`).join(' OR ');
      conditions.push(`(${genreConditions})`);
    } else if (key === 'show_ratings' && !isNaN(value)) {
      // Use AND key > value for numeric values (ratings)
      conditions.push(` ${key} > ${value}`);
    } else if (Array.isArray(value)) {
      // Use AND key = value for non-empty arrays (excluding 'genre')
      if (key !== 'genre') {
        conditions.push(` ${key} = '${value}'`);
      }
    } else {
      // Use AND key = 'value' for single values
      conditions.push(` ${key} = '${value}'`);
    }
  }
}


      // Add the conditions to the query if there are any
      if (conditions.length > 0) {
        query += conditions.join(' AND');
      }
    }

    // Add the GROUP BY and ORDER BY clauses
    query += ` GROUP BY show_table.show_id ORDER BY video_table.video_date;`;

    console.log(query);

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
        res.status(200).json({ success: true, data: results });
        console.log(results);
      }
    });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.get('/trending', (req, res) => {
  const query = `
      SELECT
      show_table.show_id AS showid,
      show_table.show_name AS title,
      show_table.total_episodes AS total_episodes,
      show_table.show_season AS season,
      show_table.show_ratings as ratings,
      DATE_FORMAT(show_table.show_date, '%Y-%m-%d') as date,
      video_table.video_id AS id
  FROM show_table
  LEFT JOIN video_table ON show_table.show_id = video_table.show_id AND video_table.episode_number = 1

  JOIN daily_rank ON show_table.show_id = daily_rank.show_id
  ORDER BY show_table.show_ratings
  LIMIT 10;
      `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.status(200).json({ success: true, data: results });
    
    }
  });
}); 

/*app.post('/video', (req, res) => {
  const decodedName = req.body.decodedName;
  const id = req.body.id;
  if (!decodedName) {
    return res.status(400).json({ error: 'Decoded name is required in the request body.' });
  }
  const sql = `SELECT * FROM video_table WHERE video_id = '${id}'`;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching video data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ data });
  });
});
*/
app.get('/video/:id', (req, res) => {
  const id = req.params.id;
  // Assuming you have a database query to fetch the video link based on the ID
  const sql = `SELECT video_link FROM video_table WHERE video_id = '${id}'`;

  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error fetching video data:', err);
          return res.status(500).send('Internal server error');
      }

      if (result.length === 0) {
          return res.status(404).send('Video not found');
      }

      const videoLink = result[0].video_link; // Assuming result is an array with at least one element containing the video link
      const stat = fs.statSync(videoLink);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

          const chunksize = end - start + 1;
          const file = fs.createReadStream(videoLink, { start, end });
          const head = {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': 'video/mp4'
          };
          res.writeHead(206, head);
          file.pipe(res);
      } else {
          const head = {
              'Content-Length': fileSize,
              'Content-Type': 'video/mp4'
          };
          res.writeHead(200, head);
          fs.createReadStream(videoLink).pipe(res);
      }
  });
});



app.post('/showinfo', (req, res) => {
  const decodedName = req.body.decodedName;
  if (!decodedName) {
    return res.status(400).json({ error: 'Decoded name is required in the request body.' });
  }

  // Now you can use decodedName in your database query or any other processing
  // Example: Fetch video data from the database based on the decodedName
  const sql = `SELECT 
  show_table.*,
  DATE_FORMAT(show_table.show_date, '%Y-%m-%d') AS formatted_date,
  GROUP_CONCAT(genre_table.genre_name) AS genres
FROM show_table
LEFT JOIN show_genre_table ON show_table.show_id = show_genre_table.show_id
LEFT JOIN genre_table ON show_genre_table.genre_id = genre_table.genre_id
WHERE show_table.show_name = '${decodedName}'
GROUP BY show_table.show_id;
`;
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching video data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json({ data });
  });
});


app.post('/random', (req, res) => {

  const sql = `SELECT
  show_table.show_id AS showid,
  show_table.show_name AS title,
  show_table.total_episodes AS total_episodes,
  show_table.show_season AS season,
  show_table.show_ratings AS ratings,
  DATE_FORMAT(show_table.show_date, '%Y-%m-%d') AS date,
  video_table.video_id AS id  
FROM show_table
LEFT JOIN video_table ON show_table.show_id = video_table.show_id AND video_table.episode_number = 1
ORDER BY RAND()
LIMIT 5;

  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching video data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ data });
  });
});



app.post('/recommended', (req, res) => {

  // Now you can use decodedName in your database query or any other processing
  //Example: Fetch video data from the database based on the decodedName
  const sql = `SELECT
  show_table.show_id AS showid,
  show_table.show_name AS title,
  show_table.total_episodes AS total_episodes,
  show_table.show_season AS season,
  show_table.show_ratings AS ratings,
  DATE_FORMAT(show_table.show_date, '%Y-%m-%d') AS date,
  video_table.video_id AS id
FROM show_table
Inner JOIN recommended_show ON show_table.show_id = recommended_show.recommend_id
LEFT JOIN video_table ON show_table.show_id = video_table.show_id AND video_table.episode_number = 1
ORDER BY RAND()
LIMIT 10;

  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching video data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log(data);
    return res.json({ data });
  });
});

app.post('/carousel', (req, res) => {

  // Now you can use decodedName in your database query or any other processing
  //Example: Fetch video data from the database based on the decodedName
  const sql = `SELECT
  show_table.show_id AS showid,
  show_table.show_name AS title,
  show_table.total_episodes AS total_episodes,
  show_table.show_description AS description,
  show_table.show_season AS season,
  show_table.show_ratings AS ratings,
  DATE_FORMAT(show_table.show_date, '%Y-%m-%d') AS date,
  video_table.video_id AS id
FROM
  show_table
INNER JOIN
  carousel_table ON show_table.show_id = carousel_table.carousel_id
LEFT JOIN
  video_table ON show_table.show_id = video_table.show_id AND video_table.episode_number = 1
LIMIT
  10;

  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching video data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ data });
  });
});


app.post('/video-filter', (req, res) => {
  const { show_name } = req.body;
   const query = `SELECT * FROM video_table
      JOIN show_table ON video_table.show_id = show_table.show_id and show_table.show_name='${show_name}'`;
    executeQuery(query, res);
 
  });

function executeQuery(query, res) {
  // Replace the database connection and query execution code as per your backend setup
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
}

app.get('/comments/:id', (req, res) => {
  const video_id = req.params.id;

  const query = `
  SELECT comments.*, users.username, users.email, users.userid
  FROM comments
  JOIN users ON comments.user_id = users.userid
  WHERE comments.video_id = ?;
  `;

  db.query(query, [video_id], (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    } else {
      
      res.status(200).json({ success: true, data: results });
    }
  });
});

app.get('/episode/:name', (req, res) => {
  const name = req.params.name; // Use req.params.name to get the show name

  const query = `
  SELECT video_table.video_id
  FROM video_table
  JOIN show_table ON video_table.show_id = show_table.show_id
  WHERE show_table.show_title = ? AND video_table.episode_number = 1;
  
  `;

  db.query(query, [name], (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    } else {
      console.log('it worked');
      console.log(results);
      res.status(200).json({ success: true, data: results });
    }
  });
});



app.post('/insert-comment', (req, res) => {
  const { videoId, commentContent, userId } = req.body;
  console.log(userId);
  if(userId==='')
  {
    res.status(404).json({ success: false, error: 'Userid not found' });
  }
  else{

    const insertCommentQuery = `
    INSERT INTO comments (user_id, video_id,  comment_content )
    VALUES (?, ?, ?);
    `;
    
    db.query(insertCommentQuery, [userId, videoId, commentContent], (insertError, insertResults) => {
      if (insertError) {
        console.error('Error inserting comment:', insertError);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      } else {
        res.status(200).json({ success: true, message: 'Comment inserted successfully' });
      }
    });
  } 
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
/**
 * User-related API endpoints for the myFlix app.
 * 
 * This file defines the routes that handle user operations.
 * Each route interacts with the database after JWT authentication.
 * 
 * @module routes/users
 */
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
// mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://arianasflix-client.netlify.app', 'http://localhost:4200', 'https://arianarobertson.github.io'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
uuid = require('uuid');
const { check, validationResult } = require('express-validator');

const port = process.env.PORT || 8080;

// Endpoint 1: Return a list of ALL movies to the user
/**
 * Returns a list of all movies to user.
 * Uses the GET method.
 * 
 * @route GET /movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Endpoint 2: Return data about a single movie by title to the user
/**
 * Returns data about a single movie by title to the user.
 * Uses the GET method.
 * 
 * @route GET /movies/:Title
 * @param {string} Title
 * @returns {json} - information about the requested movie
 */
app.get(
  '/movies/:title', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.status(200).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Endpoint 3: Return data about a genre (description) by name/title
/**
 * Returns data about a genre by name/title.
 * Uses the GET method.
 * 
 * @route GET /movies/genre/:genreName
 * @param {string} genreName
 * @returns {json} - information about the genre
 */
app.get(
  '/movies/genres/:genre', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genre })
      .then((movie) => {
        if (!movie) {
          res.status(400).send(
            'There are no movies in the database with the genre - ' + req.params.genre
          )
        } else {
          res.status(200).json(movie.Genre);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Endpoint 4: Return data about a director (bio, birth year, death year) by name
/**
 * Returns data about a director by name.
 * Uses the GET method.
 * 
 * @route GET /movies/director/:directorName
 * @param {string} directorName
 * @returns {json} - information about the director
 */
app.get(
  '/movies/directors/:director', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.director })
      .then((movie) => {
        if (!movie) {
          res.status(400).send(
            'There are no movies in the database with the director - ' + req.params.director
          )
        } else {
          res.status(200).json(movie.Director);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Endpoint 5: Allow new users to register
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  /**
 * Allows new users to register.
 * Uses the POST method.
 * 
 * @route POST /users
 * @param {string} Username
 * @param {string} Password
 * @param {string} Email
 * @param {Date} Birthday
 * @returns {string} - message with success or error
 */
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// Endpoint 6: Get user info
/**
 * Returns a list of all users.
 * Uses the GET method.
 * 
 * @route GET /users
 * @returns {array} - list of all users
 */
app.get(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.username })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Endpoint 6: Allow users to update their user info (username)
/**
 * Allows authenticated users to update their profile details.
 * Uses the PUT method.
 * 
 * @route PUT /users/:Username
 * @param {string} Username
 * @returns {json} - saves updated user information
 */
app.put(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.username },
      {
        $set:
        {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Endpoint 7: Allow users to add a movie to their list of favorites
/**
 * Allows users to add a movie to their list of favorites.
 * Uses the POST method.
 * 
 * @route POST /users/:Username/favorites/:MovieID
 * @param {string} Username
 * @param {string} MovieID
 * @returns {json} - new list of favorite movies
 */
app.post(
  '/users/:username/favorites/:movieId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $push: { FavoriteMovies: req.params.movieId }
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Endpoint 8: Allow users to remove a movie from their list of favorites
/**
 * Allows users to remove a movie from their list of favorites.
 * Uses the DELETE method.
 * 
 * @route DELETE /users/:Username/favorites/:MovieID
 * @param {string} Username
 * @param {string} MovieID
 * @returns {json} - updated list of favorite movies
 */
app.delete(
  '/users/:username/favorites/:movieId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $pull: { FavoriteMovies: req.params.movieId }
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Endpoint 9: Allow existing users to deregister
/**
 * Allows existing users to deregister.
 * Uses the DELETE method.
 * 
 * @route DELETE /users/:Username
 * @param {string} Username
 * @returns {string} - message with success or error
 */
app.delete(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.username + ' was not found');
        } else {
          res.status(200).send(req.params.username + ' was deleted');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

app.use(express.static('public'));

// General error handling
/**
 * Error handling
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Bummer!');
});

app.get('/', (req, res) => {
  res.status(200).send('Movie API Backend!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

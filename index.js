const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
uuid = require('uuid');

const port = 8080;

// Sample data for movies, genres, directors, and users
const movies = [
  { title: 'Movie 1', genre: 'Action' },
  { title: 'Movie 2', genre: 'Comedy' },
  { title: 'Movie 3', genre: 'Drama' },
];

const genres = [
  { name: 'Action', description: 'Movies filled with action sequences.' },
  { name: 'Comedy', description: 'Movies that make you laugh.' },
  { name: 'Drama', description: 'Serious and emotional films.' },
];

const directors = [
  { name: 'Director 1', bio: 'Bio of Director 1', birthYear: 1980, deathYear: null },
  { name: 'Director 2', bio: 'Bio of Director 2', birthYear: 1975, deathYear: null },
];

const users = [
  { userId: 1, username: 'User1', email: 'user1@example.com', password: 'password123', favorites: [] },
  { userId: 2, username: 'User2', email: 'user2@example.com', password: 'password456', favorites: [] },
];

// Endpoint 1: Return a list of ALL movies to the user
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
app.get(
  '/movies/:title',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
      Movies.findOne({Title: req.params.title})
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
app.get(
  '/movies/genres/:genre',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
      Movies.findOne({'Genre.Name': req.params.genre})
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
app.get(
  '/movies/directors/:director',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
      Movies.findOne({'Director.Name': req.params.director})
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
app.post(
  '/users',
  (req, res) => {
      Users.findOne({Username: req.body.Username})
      .then((user) => {
          if (user) {
              return res.status(400).send(req.body.Username + ' already exists');
          } else {
              Users.create({
                  Username: req.body.Username,
                  Password: req.body.Password,
                  Email: req.body.Email,
                  Birthday: req.body.Birthday
              })
              .then((user) => {res.status(201).json(user)})
              .catch((err) => {
                  console.error(err);
                  res.status(500).send('Error: ' + err);
              })
          }
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
  }
);

// Endpoint 6: Get user info
app.get(
  '/users/:username',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
      Users.findOne({Username: req.params.username})
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
app.put(
  '/users/:username',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
      Users.findOneAndUpdate({Username: req.params.username},
          {$set:
              {
                  Username: req.body.Username,
                  Password: req.body.Password,
                  Email: req.body.Email,
                  Birthday: req.body.Birthday
              }
          },
          {new: true}
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
app.post(
  '/users/:username/favorites/:movieId',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
      Users.findOneAndUpdate(
          {Username: req.params.username},
          {
              $push: {FavoriteMovies: req.params.movieId}
          },
          {new: true}
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
app.delete(
  '/users/:username/favorites/:movieId',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
      Users.findOneAndUpdate(
          {Username: req.params.username},
          {
              $pull: {FavoriteMovies: req.params.movieId}
          },
          {new: true}
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
app.delete(
  '/users/:username',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
      Users.findOneAndRemove({Username: req.params.username})
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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Bummer!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Sample data for top 10 movies
const topMovies = [
  { title: 'Movie 1', genre: 'Action' },
  { title: 'Movie 2', genre: 'Comedy' },
  { title: 'Movie 3', genre: 'Romance' },
  { title: 'Movie 4', genre: 'Romantic Comedy' },
  { title: 'Movie 5', genre: 'Drama' },
  { title: 'Movie 6', genre: 'Crime' },
  { title: 'Movie 7', genre: 'Crime' },
  { title: 'Movie 8', genre: 'Crime' },
  { title: 'Movie 9', genre: 'Crime' },
  { title: 'Movie 10', genre: 'Comedy' },
  { title: 'Movie 11', genre: 'Comedy' },

  // Add more movies as needed
];
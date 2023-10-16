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
app.use(express.urlencoded({ extended: true }));
uuid = require('uuid');

const port = 8080;


// Middleware to log all requests
app.use(morgan('dev'));
app.use(express.static('public'))

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
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error retrieving movies.');
    });
});

// Endpoint 2: Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  const movieTitle = req.params.title;

  Movies.findOne({ Title: movieTitle })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error retrieving movie.');
    });
});

// Endpoint 3: Return data about a genre (description) by name/title
app.get('/genres/:name', (req, res) => {
  const genreName = req.params.name;

  Movies.findOne({ 'Genre.Name': genreName })
    .then((genre) => {
      res.status(200).json({ Description: genre.Genre.Description });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error retrieving genre.');
    });
});

// Endpoint 4: Return data about a director (bio, birth year, death year) by name
app.get('/directors/:name', (req, res) => {
  const directorName = req.params.name;

  Movies.findOne({ 'Director.Name': directorName })
    .then((director) => {
      res.status(200).json({
        Bio: director.Director.Bio,
        BirthYear: director.Director.BirthYear,
        DeathYear: director.Director.DeathYear,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error retrieving director.');
    });
});

// Endpoint 5: Allow new users to register
app.post('/users', (req, res) => {
  const userData = req.body;

  Users.create(userData)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error registering user.');
    });
});

// Endpoint 6: Allow users to update their user info (username)
app.put('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const updatedData = req.body;

  Users.findByIdAndUpdate(userId, updatedData, { new: true })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error updating user information.');
    });
});

// Endpoint 7: Allow users to add a movie to their list of favorites
app.post('/users/:userId/favorites', (req, res) => {
  const userId = req.params.userId;
  const movieId = req.body.movieId;

  Users.findByIdAndUpdate(
    userId,
    { $push: { FavoriteMovies: movieId } },
    { new: true }
  )
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error adding a movie to favorites.');
    });
});

// Endpoint 8: Allow users to remove a movie from their list of favorites
app.delete('/users/:userId/favorites/:movieId', (req, res) => {
  const userId = req.params.userId;
  const movieId = req.params.movieId;

  Users.findByIdAndUpdate(
    userId,
    { $pull: { FavoriteMovies: movieId } },
    { new: true }
  )
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error removing a movie from favorites.');
    });
});

// Endpoint 9: Allow existing users to deregister
app.delete('/users/:userId', (req, res) => {
  const userId = req.params.userId;

  Users.findByIdAndRemove(userId)
    .then(() => {
      res.status(200).send('User account removed successfully.');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error removing user account.');
    });
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
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
uuid = require('uuid');

const port = 8080;


// Middleware to log all requests
app.use(morgan('dev'));

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
  res.json(movies);
});

// Endpoint 2: Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  const title = req.params.title;
  const movie = movies.find(movie => movie.title === title);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send('Movie not found.');
  }
});

// Endpoint 3: Return data about a genre (description) by name/title
app.get('/genres/:name', (req, res) => {
  const name = req.params.name;
  const genre = genres.find(genre => genre.name === name);

  if (genre) {
    res.json({ description: genre.description });
  } else {
    res.status(404).send('Genre not found.');
  }
});

// Endpoint 4: Return data about a director (bio, birth year, death year) by name
app.get('/directors/:name', (req, res) => {
  const name = req.params.name;
  const director = directors.find(director => director.name === name);

  if (director) {
    res.json({
      bio: director.bio,
      birthYear: director.birthYear,
      deathYear: director.deathYear,
    });
  } else {
    res.status(404).send('Director not found.');
  }
});

// Endpoint 5: Allow new users to register
app.post('/users', (req, res) => {
  const newUser = req.body;
  newUser.userId = users.length + 1;
  users.push(newUser);
  res.json({ message: 'User registered successfully', user: newUser });
});

// Endpoint 6: Allow users to update their user info (username)
app.put('/users/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const updatedUserData = req.body;
  
  const userIndex = users.findIndex(user => user.userId === userId);
  
  if (userIndex !== -1) {
    users[userIndex].username = updatedUserData.username;
    res.json({ message: 'User information updated successfully', user: users[userIndex] });
  } else {
    res.status(404).send('User not found.');
  }
});

// Endpoint 7: Allow users to add a movie to their list of favorites
app.post('/users/:userId/favorites', (req, res) => {
  const userId = parseInt(req.params.userId);
  const movieIdToAdd = req.body.movieId;
  
  const user = users.find(user => user.userId === userId);
  
  if (user) {
    user.favorites.push(movieIdToAdd);
    res.json({ message: 'Movie added to favorites successfully', user });
  } else {
    res.status(404).send('User not found.');
  }
});

// Endpoint 8: Allow users to remove a movie from their list of favorites
app.delete('/users/:userId/favorites/:movieId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const movieIdToRemove = req.params.movieId;
  
  const user = users.find(user => user.userId === userId);
  
  if (user) {
    const index = user.favorites.indexOf(movieIdToRemove);
    if (index !== -1) {
      user.favorites.splice(index, 1);
      res.json({ message: 'Movie removed from favorites successfully', user });
    } else {
      res.status(404).send('Movie not found in favorites.');
    }
  } else {
    res.status(404).send('User not found.');
  }
});

// Endpoint 9: Allow existing users to deregister
app.delete('/users/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  
  const userIndex = users.findIndex(user => user.userId === userId);
  
  if (userIndex !== -1) {
    const removedUser = users.splice(userIndex, 1)[0];
    res.json({ message: 'User deregistered successfully', removedUser });
  } else {
    res.status(404).send('User not found.');
  }
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
// Import necessary modules and set up Express app
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 8080; // Choose a suitable port number

// Middleware to log all requests
app.use(morgan('dev'));

// Sample data for movies, genres, directors, and users
// Replace with your actual data or database integration
const movies = [
  { title: 'Movie 1', genre: 'Action' },
  { title: 'Movie 2', genre: 'Comedy' },
  // Add more movie objects as needed
]; // Your movie data
const genres = [
  { name: 'Action', description: 'Movies filled with action sequences.' },
  { name: 'Comedy', description: 'Movies that make you laugh.' },
  // Add more genre objects as needed
]; // Your genre data
const directors = [
  { name: 'Director 1', bio: 'Bio of Director 1', birthYear: 1980, deathYear: null },
  { name: 'Director 2', bio: 'Bio of Director 2', birthYear: 1975, deathYear: null },
  // Add more director objects as needed
]; // Your director data
const users = [
  { username: 'User1', email: 'user1@example.com', password: 'hashedPassword' },
  { username: 'User2', email: 'user2@example.com', password: 'hashedPassword' },
  // Add more user objects as needed
]; // Your user data

// Express route for /movies
app.get('/movies', (req, res) => {
  // Return a list of all movies
  res.json(movies);
});

// Express route for /movies/:title
app.get('/movies/:title', (req, res) => {
  // Return data about a single movie by title
  const title = req.params.title;
  const movie = movies.find(movie => movie.title === title);
  
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send('Movie not found.');
  }
});

// Express route for /genres/:name
app.get('/genres/:name', (req, res) => {
  // Return data about a genre by name
  const name = req.params.name;
  const genre = genres.find(genre => genre.name === name);
  
  if (genre) {
    res.json({ description: genre.description });
  } else {
    res.status(404).send('Genre not found.');
  }
});

// Express route for /directors/:name
app.get('/directors/:name', (req, res) => {
  // Return data about a director by name
  const name = req.params.name;
  const director = directors.find(director => director.name === name);
  
  if (director) {
    res.json({ bio: director.bio, birthYear: director.birthYear, deathYear: director.deathYear });
  } else {
    res.status(404).send('Director not found.');
  }
});

// Express route for /users
app.post('/users', (req, res) => {
  // Handle user registration
  // Add new user to the users array or your database
  // Return a success message or user object
});

// Express route for /users/:userId
app.put('/users/:userId', (req, res) => {
  // Handle user profile update
  // Update the user's information in the users array or your database
  // Return a success message or updated user object
});

// Express route for /users/:userId/favorites
app.post('/users/:userId/favorites', (req, res) => {
  // Handle adding a movie to user's favorites
  // Update the user's favorites in the users array or your database
  // Return a success message or updated user object
});

// Express route for /users/:userId/favorites/:movieId
app.delete('/users/:userId/favorites/:movieId', (req, res) => {
  // Handle removing a movie from user's favorites
  // Update the user's favorites in the users array or your database
  // Return a success message or updated user object
});
// Express route for /users/:userId
app.delete('/users/:userId', (req, res) => {
  // Handle user deregistration
  // Remove the user from the users array or your database
  // Return a success message
});

// Express static file serving
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Application-level error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
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
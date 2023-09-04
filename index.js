const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 8080; // Choose a suitable port number

// Middleware to log all requests
app.use(morgan('dev'));

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
  // Add more movies as needed
];

// Express route for /movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Express route for /movies/:title
app.get('/movies/:title', (req, res) => {
  const title = req.params.title;
  const movie = topMovies.find(movie => movie.title === title);
  
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send('Movie not found.');
  }
});

// Express route for /
app.get('/', (req, res) => {
  res.send('Welcome to My Movie App!');
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

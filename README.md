# myFlix API

## Objective
The **myFlix API** is the server-side component of a web application that provides users with access to information about different movies, directors, and genres. Users can sign up, update their personal information, and create a list of their favorite movies. This project is built using the **MERN (MongoDB, Express, React, Node.js) stack** and follows RESTful API architecture.

## Features
### Essential Features
- Return a list of all movies.
- Return data about a single movie by title (description, genre, director, image URL, featured status).
- Return data about a genre by name.
- Return data about a director (bio, birth year, death year) by name.
- Allow new users to register.
- Allow users to update their user info (username, password, email, date of birth).
- Allow users to add a movie to their list of favorites.
- Allow users to remove a movie from their list of favorites.
- Allow existing users to deregister.

### Optional Features
- Allow users to see which actors star in which movies.
- Allow users to view information about different actors.
- Allow users to view more information about different movies, such as release date and ratings.
- Allow users to create a “To Watch” list in addition to their “Favorite Movies” list.

## Technologies Used
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT (JSON Web Token)** - Authentication & Authorization
- **Heroku** - Deployment platform
- **Postman** - API testing
- **Morgan** - Logging middleware
- **Body-parser** - Middleware for parsing request bodies

## API Endpoints
| HTTP Method | Endpoint | Description |
|-------------|------------|--------------|
| GET | `/movies` | Returns a list of all movies |
| GET | `/movies/:title` | Returns data about a single movie by title |
| GET | `/genres/:name` | Returns data about a genre by name |
| GET | `/directors/:name` | Returns data about a director by name |
| POST | `/users` | Register a new user |
| PUT | `/users/:username` | Update user information |
| POST | `/users/:username/movies/:movieID` | Add a movie to a user's favorites |
| DELETE | `/users/:username/movies/:movieID` | Remove a movie from a user's favorites |
| DELETE | `/users/:username` | Deregister a user |

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/myflix-api.git
   cd myflix-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env` file):
   ```plaintext
   PORT=8080
   MONGO_URI=your_mongodb_connection_string
   SECRET_KEY=your_secret_key
   ```
4. Start the server:
   ```sh
   npm start
   ```

## Authentication & Security
- Uses **JWT-based authentication** for user login.
- Implements **data validation** to ensure data integrity.
- Follows **data security best practices** for secure storage and API access.

## Deployment
The API is hosted on **Heroku** and publicly accessible. Ensure you have Heroku CLI installed and run:
```sh
heroku login
heroku create myflix-api
heroku config:set MONGO_URI=your_mongodb_connection_string
heroku config:set SECRET_KEY=your_secret_key
```
Then deploy the project:
```sh
git push heroku main
```

## Testing
- **Postman** is recommended for testing API endpoints.
- Use `npm test` for running automated tests.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries, feel free to reach out via GitHub Issues.


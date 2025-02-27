/**
 * This file handles user authentication.
 * 
 * This module configures Passport.js to authenticate users using:
 * LocalStrategy: Checks username and password against the database.
 * JWTStrategy: Extracts JWT from the request and verifies the user.
 */
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * Local authentication strategy.
 * 
 * Verifies user credentials against the database.
 * 
 * @name LocalStrategy
 * @function
 * @param {string} username - username entered by the user
 * @param {string} password - password entered by the user
 * @param {function} callback - calls with authentication result
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await Users.findOne({ Username: username })
        .then((user) => {
          if (!user) {
            console.log('incorrect username');
            return callback(null, false, {
              message: 'Incorrect username or password.',
            });
          }
          if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null, false, { message: 'Incorrect password.' });
          }
          console.log('finished');
          return callback(null, user);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
        })
    }
  )
);

/**
 * JWT authentication strategy.
 * 
 * Extracts JWT from request headers and verifies the user's identity.
 * 
 * @name JWTStrategy
 * @function
 * @param {Object} jwtPayload - decoded JWT payload containing user data
 * @param {function} callback - calls with authentication result
 */
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
  return await Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));
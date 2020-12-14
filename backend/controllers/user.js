const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/User");

/**
 * Encrypts the user's password, adds the user to the database
 * 
 * @param {Object} req - The request to register the user's account
 * @param {string} req.body.email - The user's email
 * @param {string} req.body.password - The user password
 * 
 */
exports.signup = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * Verifies user's credentials,
 * returning the user's identifier from the database data and the associated authentication token 
 *
 * @param {Object} req - The request to login using user's credentials
 * @param {string} req.body.email - The user's email
 * @param {string} req.body.password - The user password
 */

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id},
              'RANDOM_CODE_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
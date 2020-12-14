const Sauce = require("../models/Sauce");
const fs = require('fs');

/**
 * Uploads the image,
 * analyzes the sauce using a character string
 * and records it in the database, by defining correctly its URL image.
 * Reset the loved sauces and those hated at 0,
 * and the usersliked sauces and those usersdisliked to empty arrays.
 * 
 * @param {Object} req - The request containing the new sauce to create
 * @param {Object} res - The response sent to the client
 * @param {Object} req.body.sauce - The informations about the sauce
 * @param {File}   req.file.filename - User's file image name
 * 
 */
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  sauceObject.likes = 0;
  sauceObject.dislikes = 0;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: "Sauce ajouté!" }))
    .catch((error) => res.status(400).json({ error }));
};

/**
 * Updates the sauce with the identifier provided.
 * If an image is provided, register it and update the image URL of the sauces.
 * If no file is provided, the details of the sauce figure appears in the body of the application
 * (req.body.name, req.body.heat etc).
 * If a file is provided, the sauce is in req.body.sauce.
 * 
 * @param {Object} req - The request containing the changes to a specific sauce
 * @param {Object} res - The response sent to the client
 * @param {Object} req.body.sauce - The informations about the sauce
 * @param {File}   req.file.filename - User's file image name
 */
exports.modifySauce = (req, res) => {
  const sauce = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body};
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => res.status(200).json({ message: "Sauce modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

/*
 * Returns the table of all sauces in the database
 */
exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

/**
 * Returns the sauce with the ID provided
 *
 * @param {String} req.params.id - User's ID
 */
exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

/**
 * Removes the sauce with the provided ID.
 * 
 * @param {String} req.params.id - User's ID
 */

exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * Defines the status "like" for the provided userID.
 * If I like = 1, the user likes the sauce.
 * If I like = 0, the user cancels the preferences.
 * If I like = -1, the user does not like not the sauce.
 * The identifier of the user must be added or removed from the appropriate table, in
 * keeping track of preferences and in preventing him from loving or not to like the
 * same sauce several times.
 * Total number of "I like" and "I don't like". not" to be updated with every "I like".
 *
 * @param {String} req.params.id - User's ID
 */

exports.setLike = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      console.log(req.body);
      const userIdInUsersLiked = sauce.usersLiked.indexOf(req.body.userId);
      const userIdInUsersDisliked = sauce.usersDisliked.indexOf(req.body.userId);
      if (req.body.like == 1) {
        if (userIdInUsersLiked == -1 && userIdInUsersDisliked == -1) { 
          console.log("Je n'avais pas de préférence, mais maintenant j'aime ça !");   
          sauce.likes++;
          sauce.usersLiked.push(req.body.userId);
        } else if (userIdInUsersDisliked != -1 && userIdInUsersLiked == -1){
          console.log("Je n'aimais pas ça, mais maintenant si !");
          sauce.dislikes--;
          sauce.usersDisliked.splice(userIdInUsersDisliked, 1);
          sauce.likes++;
          sauce.usersLiked.push(req.body.userId);
        } else if (userIdInUsersDisliked == -1 && userIdInUsersLiked != -1){
          console.log("J'aime ça et j'aime toujours ça...");
        }
      } else if (req.body.like == -1) {
        if (userIdInUsersLiked == -1 && userIdInUsersDisliked == -1) {
          console.log("Je n'avais pas de préférence, j'ai essayé et ça craint !");
          sauce.dislikes++;
          sauce.usersDisliked.push(req.body.userId);
        } else if (userIdInUsersDisliked != -1 && userIdInUsersLiked == -1) {
          console.log("Je n'ai pas aimé et je n'aime toujours pas...");
        } else if (userIdInUsersDisliked == -1 && userIdInUsersLiked != -1) {
          console.log("Avant, je l'aimais bien, mais maintenant il me dégoûte.");
          sauce.likes--;
          sauce.usersLiked.splice(userIdInUsersLiked, 1);
          sauce.dislikes++;
          sauce.usersDisliked.push(req.body.userId);
        }
      } else if (req.body.like == 0) {
        if (userIdInUsersLiked != -1) {
          console.log("J'ai changé d'avis, je ne suis pas sûr de l'aimer !");
          sauce.usersLiked.splice(userIdInUsersLiked, 1);
          sauce.likes--;
        } else if (userIdInUsersDisliked != -1) {
          console.log("J'ai changé d'avis. Ce n'est pas si terrible après tout...");
          sauce.usersDisliked.splice(userIdInUsersDisliked, 1);
          sauce.dislikes--;
        }
      }
      Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => res.status(200).json({ message: "J'aime modifié"}))
        .catch(error => res.status(400).json({ error }));

    })
    .catch(error => res.status(500).json({ error }));
};

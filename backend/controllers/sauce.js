const Sauce = require("../models/Sauce");
const fs = require('fs');

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

exports.modifySauce = (req, res) => {
  const sauce = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body};
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => res.status(200).json({ message: "Sauce modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

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
          console.log("Je n'aimais pas ça, mais maintenant si ! Cette condition ne se produit JAMAIS");
          sauce.dislikes--;
          sauce.usersDisliked.splice(userIdInUsersDisliked, 1);
          sauce.likes++;
          sauce.usersLiked.push(req.body.userId);
        } else if (userIdInUsersDisliked == -1 && userIdInUsersLiked != -1){
          console.log("J'aime ça et j'aime toujours ça... Cette condition ne se produit JAMAIS");
        }
      } else if (req.body.like == -1) {
        if (userIdInUsersLiked == -1 && userIdInUsersDisliked == -1) {
          console.log("Je n'avais pas de préférence, j'ai essayé et ça craint !");
          sauce.dislikes++;
          sauce.usersDisliked.push(req.body.userId);
        } else if (userIdInUsersDisliked != -1 && userIdInUsersLiked == -1) {
          console.log("Je n'ai pas aimé et je n'aime toujours pas... Cette condition ne se produit JAMAIS");
        } else if (userIdInUsersDisliked == -1 && userIdInUsersLiked != -1) {
          console.log("Avant, je l'aimais bien, mais maintenant il me dégoûte. Cette condition ne se produit JAMAIS");
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

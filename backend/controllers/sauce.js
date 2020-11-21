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
      if (req.body.like == 1 && sauce.usersLiked.indexOf(req.body.userId) == -1) {
        sauce.likes += req.body.like;
        sauce.usersLiked.push(req.body.userId);
      } else if (req.body.like == -1 && sauce.usersDisliked.indexOf(req.body.usersId) == -1) {
        sauce.dislikes -= req.body.like;
        sauce.usersDisliked.push(req.body.userId);
      }
      Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => res.status(200).json({ message: "J'aime modifié"}))
        .catch(error => res.status(400).json({ error }));

    })
    .catch(error => res.status(500).json({ error }));
};

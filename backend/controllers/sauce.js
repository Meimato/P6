const Sauce = require("../models/Sauce");

exports.createSauce = (req, res) => {
  console.log(req.body)
  const sauce = new Sauce({
    userId: 'qsdd@deed.cole',
    name: "Lava",
    manufacturer: "Etna volcan",
    description: "An erupting volcano in your mouth",
    mainPepper: "Hot Chili",
    imageUrl:
      "https://www.sprinklesandsprouts.com/wp-content/uploads/2019/01/5-minute-salsa-SQ.jpg",
    heat: 10,
    likes: 8,
    dislikes: 2,
  });
  sauce.save()
    .then(() => res.status(201).json({ message: "Sauce added!" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res) => {
  const sauce = new Sauce({
    userId: req.params.id,
    name: req.params.name,
    manufacturer: req.params.manufacturer,
    description: req.params.description,
    mainPepper: req.params.mainPepper,
    imageUrl:
      "https://www.sprinklesandsprouts.com/wp-content/uploads/2019/01/5-minute-salsa-SQ.jpg",
    heat: req.params.heat,
    likes: req.params.likes,
    dislikes: req.params.dislikes,
  });
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => res.status(200).json({ message: "Object modifié" }))
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
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé" }))
    .catch((error) => res.status(400).json({ error }));
};

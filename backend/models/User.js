/*
Le modèle de données pour un utilisateur est le suivant :
    ● userId: string — identifiant unique MongoDB pour l'utilisateur qui a créé la sauce ;
    ● email: string — adresse électronique de l'utilisateur [unique] ;
    ● password: string — hachage du mot de passe de l'utilisateur
*/

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

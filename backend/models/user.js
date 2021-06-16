//importation du package mangoose
const mongoose = require("mongoose");
//installation du package de validation
const uniqueValidator = require("mongoose-unique-validator");

//création de la constante userSchema avec le schema respectant les consignes
const userSchema = mongoose.Schema({
    //utilisation du mot-clef unique pour s'assurer que 2 utilisateurs ne peuvent pas utiliser la même adresse email
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

//plugin qui s'assure que 2 utilisateur ne peuvent avoir le même mot de passe
userSchema.plugin(uniqueValidator);

//exportation du schéma
module.exports = mongoose.model("User", userSchema);

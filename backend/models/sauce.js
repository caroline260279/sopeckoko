//importation du package mangoose
const mongoose = require("mongoose");

//création du schema tel que requis dans les consignes
const sauceSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    mainPepper: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    heat: {
        type: Number,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    usersLiked: {
        type: [String],
        default: [0],
    },
    usersDisliked: {
        type: [String],
        default: [0],
    },
});

//exportation du model
module.exports = mongoose.model("Sauce", sauceSchema);

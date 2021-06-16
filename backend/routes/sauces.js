//création de routes pour dissocier la logique de routing de la logique métier

//importation du package express
const express = require("express");
//création du router express
const router = express.Router();

//importation de la "logique métier" des sauces (les fonctions)
const sauceCtrl = require("../controllers/sauces");
//importation du middelware d'authentification
const auth = require("../middelware/auth");
//importation du middelware multer
const multer = require("../middelware/multer-config");

//création des routes avec les différents endpoints de l'application et les middelwares necessaires

//route pour créer une sauce nécessite l'authentification et multer pour l'image
router.post("/", auth, multer, sauceCtrl.createSauce);
//route pour récupérer toutes les sauces, necessite l'authentification
router.get("/", auth, sauceCtrl.getAllSauce);
//route pour récupérer une sauce, necessite l'authentification
router.get("/:id", auth, sauceCtrl.getOneSauce);
//route pour modifier une sauce, necessite l'authentification et multer pour l'image
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
//route pour supprime une sauce, necessite l'authentification
router.delete("/:id", auth, sauceCtrl.deleteSauce);
//route pour liker ou disliker une sauce, necessite l'authentification
router.post("/:id/like", auth, sauceCtrl.likeSauce);

//exportation du router
module.exports = router;

//création de la logique métier pour les users

//importation du package bcrypt (cryptage)
const bcrypt = require("bcrypt");
//importation du model user
const User = require("../models/user");
//importation du package jsonwebtoken
const jwt = require("jsonwebtoken");

//création du middelware signup
exports.signup = (req, res, next) => {
    //hachage du mdp avec 10 tours de l'algorithme
    bcrypt
        .hash(req.body.password, 10)
        //recupation du hash
        .then((hash) => {
            //création du nouvel utilisateur
            const user = new User({
                //avec l'email recupéré dans le body de la requete
                email: req.body.email,
                //et avec le hash comme mdp
                password: hash,
            });
            //on sauvegarde
            user.save()
                //renvoie "utilisateur créé" si ok sinon une erreur
                .then(() =>
                    res.status(201).json({
                        message: "Utilisateur créé !",
                    })
                )
                .catch((error) =>
                    res.status(400).json({
                        error,
                    })
                );
        })
        //sinon retourne une erreur
        .catch((error) =>
            res.status(500).json({
                error,
            })
        );
};

//création du middelware login
exports.login = (req, res, next) => {
    //utilisation de la méthode findOne pour trouver un seul utilisateur (qui est forcément unique)
    User.findOne({
        //l'adresse mail doit correspondre à l'adresse mail de la requête
        email: req.body.email,
    })
        //renvoie le user
        .then((user) => {
            //si pas de user alors renvoie "utilisateur non trouvé"
            if (!user) {
                return res.status(401).json({
                    error: "Utilisateur non trouvé !",
                });
            }
            //si un user est trouvé on utilise bcrypt pour comparer le mdp
            bcrypt
                //compare le mpd du user et le mdp de la requête
                .compare(req.body.password, user.password)
                //reception d'un booléen
                .then((valid) => {
                    //si mauvais mdp alors "mdp incorrect"
                    if (!valid) {
                        return res.status(401).json({
                            error: "Mot de passe incorrect !",
                        });
                    }
                    //sinon requête ok
                    res.status(200).json({
                        //renvoie le userId
                        userId: user._id,
                        //renvoie un token avec jsonwebtoken
                        //appel de la fonction sign de jsonwebtoken
                        //le userId encoder permettra de ne pas pouvoir modifier un objet si on ne l'a pas crée
                        token: jwt.sign(
                            //les données que l'on souhaite encoder
                            {
                                userId: user._id,
                            },
                            //clef secrète d'encodage
                            "RANDOM_TOKEN_SECRET",
                            //on applique une expiration
                            {
                                expiresIn: "24h",
                            }
                        ),
                    });
                })
                //sinon renvoie un probème de connexion
                .catch((error) =>
                    res.status(500).json({
                        error,
                    })
                );
        })
        //sinon renvoie un probème de connexion
        .catch((error) =>
            res.status(500).json({
                error,
            })
        );
};

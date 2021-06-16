//création de la logique métier pour les sauces

//importation du model de données pour les sauces
const Sauce = require("../models/sauce");

//importation du package fs (file system)
const fs = require("fs");

//création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    //création d'une constante qui recupere le body de la sauce parsé
    const sauceObject = JSON.parse(req.body.sauce);
    //suppression de l'id généré par le frontend
    delete sauceObject._id;
    //création d'une nouvelle instance pour nos sauces
    const sauce = new Sauce({
        //l'opérateur scread permet de faire un raccourci pour faire une copie de tous les elements de req.body
        ...sauceObject,
        //on modifie l'url de l'image
        //${req.protocol}=http,${req.get("host")}=localhost:3000
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
        //à la création de la sauce ces éléments sont soient à 0, soit vides
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce
        //La méthode save() enregistre la sauce dans la base de données
        .save()
        //renvoi "sauce enregistrée" si ok ou une erreur 400
        .then(() =>
            res.status(201).json({
                message: "Sauce enregistrée !",
            })
        )
        .catch((error) =>
            res.status(400).json({
                error,
            })
        );
};

//accéder aux informations d'une sauce en particulier
exports.getOneSauce = (req, res, next) => {
    //la méthode findOne() permet trouver la sauce unique ayant le même _id que le paramètre de la requête
    Sauce.findOne({
        _id: req.params.id,
    })
        //renvoie la sauce ou une erreur
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

//modification de la sauce selectionnée
exports.modifySauce = (req, res, next) => {
    //création de la constante sauceObject avec l'opérateur ternaire ?
    //si req.file existe on aura un certain type d'objet et sinon un autre
    const sauceObject = req.file
        ? //utilisation
          {
              //si le fichier existe on applique ce que l'on a fait pour createSauce
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : //s'il n'existe pas on fait un copie de req.body
          { ...req.body };
    Sauce.updateOne(
        //l'id correspond a l'id de la requete
        { _id: req.params.id },
        //utilisation de scread pour recuperer l'ensemble des données de sauceObject
        { ...sauceObject, _id: req.params.id }
    )
        //renvoie "objet modifié" si ok ou une erreur
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};

//suppression de la sauce selectionnée
exports.deleteSauce = (req, res, next) => {
    //on récupére la sauce à supprimer pour récuperer l'url de l'image
    Sauce.findOne({ _id: req.params.id })
        //renvoie la sauce
        .then((sauce) => {
            //récupération du nom du fichier
            const filename = sauce.imageUrl.split("/images/")[1];
            //on utilise la fonction unlink du package fs pour supprimer ce fichier
            fs.unlink(`images/${filename}`, () => {
                //une fois le fichier supprimer on supprime la sauce de la base de données
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res.status(200).json({ message: "Sauce supprimée !" })
                    )
                    //sinon renvoie une erreur
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

//récupération de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    //la méthode find() permet de renvoyer un tableau contenant tous les Things dans notre base de données.
    Sauce.find()
        //renvoie les sauces ou une erreur
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

//mettre un like ou un dislike, ajouter l'utilisateur
exports.likeSauce = (req, res, next) => {
    //variale like, si like
    const like = req.body.like;
    //variale userId
    const userId = req.body.userId;
    //variale sauceId, l'id de la sauce
    const sauceId = req.params.id;

    //si le like est coché (l'utilisateur aime la sauce)
    if (like === 1) {
        //mise a jour de la saude
        Sauce.updateOne(
            {
                _id: sauceId,
            },
            {
                //on push le userId dans le tableau usersLiked
                //avec l'opérateur mongoose $push qui incrémente le tableau dans la base de données
                $push: {
                    usersLiked: userId,
                },
                //on incrémente le champs de la valeur likes
                $inc: {
                    likes: +1,
                },
            }
        )
            //revoie "j'aime" si ok ou une erreur
            .then(() =>
                res.status(200).json({
                    message: "j'aime!",
                })
            )
            .catch((error) =>
                res.status(400).json({
                    error,
                })
            );
    }
    //si dislike est coché (l'utilisateur n'aime pas la sauce)
    if (like === -1) {
        //mise a jour de la sauce
        Sauce.updateOne(
            {
                _id: sauceId,
            },
            {
                //on push le userId dans le tableau usersDisliked dans la base de données grace à l'opérateur mangoose $push
                $push: {
                    usersDisliked: userId,
                },
                //on incrément le champs du dislikes avec $inc
                $inc: {
                    dislikes: +1,
                },
            }
        )
            //si ok renvoie "Dislike ajouté", sinon une erreur
            .then(() => {
                res.status(200).json({
                    message: "Dislike ajouté !",
                });
            })
            .catch((error) =>
                res.status(400).json({
                    error,
                })
            );
    }
    //si l'utilisateur n'aime plus une sauce ou si l'utilisateur ne "déteste" plus une sauce
    if (like === 0) {
        //on récupère la sauce dans la base de données
        Sauce.findOne({
            _id: sauceId,
        })
            .then((sauce) => {
                //si l'utilisateur apparait dans le usersLiked, soit: l'utilisateur n'aime plus la sauce
                if (sauce.usersLiked.includes(userId)) {
                    //mise à jour de la sauce
                    Sauce.updateOne(
                        {
                            _id: sauceId,
                        },
                        {
                            //on supprime l'utilissateur du tableau grace à l'opérateur mangoose $pull
                            $pull: {
                                usersLiked: userId,
                            },
                            //on décremente le champs likes
                            $inc: {
                                likes: -1,
                            },
                        }
                    )
                        //renvoie "je n'aime plus" si ok sinon une erreur
                        .then(() =>
                            res.status(200).json({
                                message: "Je n'aime plus!",
                            })
                        )
                        .catch((error) =>
                            res.status(400).json({
                                error,
                            })
                        );
                }
                //si le userId apparait dans le usersDisliked, soit: l'utilisateur ne deteste plus la sauce
                if (sauce.usersDisliked.includes(userId)) {
                    //mise à jour de la sauce
                    Sauce.updateOne(
                        {
                            _id: sauceId,
                        },
                        {
                            //on supprime le userId du tableau usersDisliked dans la base de données grace à l'opérateur mongoose $pull
                            $pull: {
                                usersDisliked: userId,
                            },
                            //on décremente le champs dislikes
                            $inc: {
                                dislikes: -1,
                            },
                        }
                    )
                        //renvoie "dislike supprimé" si ok sinon une erreur
                        .then(() =>
                            res.status(200).json({
                                message: "dislike supprimé !",
                            })
                        )
                        .catch((error) =>
                            res.status(400).json({
                                error,
                            })
                        );
                }
            })
            //renvoi une erreur
            .catch((error) =>
                res.status(404).json({
                    error,
                })
            );
    }
};

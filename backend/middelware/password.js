//importation du model de données pour le password
const passwordValid = require("../models/password");

module.exports = (req, res, next) => {
    //si le mot de passe dans le corps de la requete ne correspond pas au schema
    if (!passwordValid.validate(req.body.password)) {
        console.log(req.body.password);
        //renvoyer une erreur 401 et le message
        return res.status(401).json({
            error: "mot de passe requis:majuscule, minuscule, 2 chiffres,1 symbole, pas d'espace !",
        });
    }
    //sinon passer au middelware suivant
    else {
        next();
    }
};

//pour faciliter la gestion de fichier envoyer avec des requêtes http vers l'api, on utilise multer
//on importe le package multer
const multer = require("multer");

//création d'un objet qui présente les 3 differents mime type que l'on peut retrouver
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

//création d'un objet de configuration pour multer
//on utilise la fonction diskStorage pour dire qu'on l'enregistre sur le disk
const storage = multer.diskStorage({
    //on lui donne la destination: le dossier image
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    //on lui donne le nom de fichier
    filename: (req, file, callback) => {
        //création de la partie avant l'extension
        //on récupère le nom original en remplaçant les espaces par des _
        let name = file.originalname.split(" ").join("_");
        //on utilise les mime types pour générer l'extension du fichier
        let extension = MIME_TYPES[file.mimetype];
        name = name.replace("." + extension, "_");
        //on appelle le callback avec le filename entier
        //ce sera le name avec un timestamp pour le rendre le plus unique possible, puis un point et son extension
        callback(null, name + Date.now() + "." + extension);
    },
});

//on exporte le middelware
//on appelle multer a laquelle on passe l'objet storage
//et on appelle la méthode single() pour dire qu'il s'agit d'un fichier unique en expliquant qu'il s'agit de fichiers image
module.exports = multer({
    storage: storage,
}).single("image");

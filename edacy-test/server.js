var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
const User = require("./users/user.model");
var sha256 = require("sha256");
const swaggerUi = require('swagger-ui-express');



var ObjectID = mongodb.ObjectID;

var USERS_COLLECTION = "users";

var app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/users", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = client.db();
  console.log("connexion etablie..");


  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("l'application tourne sur le port ", port);
  });
});

function handleError(res, reason, message, code) {
  console.log("Erreur : " + reason);
  res.status(code || 500).json({ "error": message });
}

/*  "/api/users"
 *    GET: recuperer tous les utilisateurs
 *    POST: creer un nouvel utilisateur
 */

app.get("/api/users", function (req, res) {
  db.collection(USERS_COLLECTION).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Erreur reception utilisateurs");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/users", function (req, res) {
  var newUser = req.body;
  console.log(newUser);
  if (!req.body.login || !req.body.firstName || !req.body.lastName || !req.body.password) {
    handleError(res, "donnees invalides", "Renseigner tous les champs", 400);
  } else {
    const user = new User({
      login: req.body.login,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: sha256(req.body.password)
    });
    db.collection(USERS_COLLECTION).insertOne(user, function (err, doc) {
      if (err) {
        handleError(res, err.message, "Echec de la creation");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/*  "/api/users/:id"
 *    GET: trouver un utilisateur par son id
 *    PUT: mettre a jour un utilisateur en se basant sur l'id
 *    DELETE: supprimer un utilisateur en se basant sur l'id
 */

app.get("/api/users/:id", function (req, res) {
  db.collection(USERS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Erreur lors de la reception de l'utilisateur");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/users/:id", function (req, res) {
  var updateDoc = req.body;
  db.collection(USERS_COLLECTION).updateOne({ _id: new ObjectID(req.params.id) }, { $set: { password: req.body.password } }, { upsert: true }, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Echec du mis a jour");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/users/:id", function (req, res) {
  db.collection(USERS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
    if (err) {
      handleError(res, err.message, "Echec de la suppression");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});

app.post("/api/users/login", function (req, res) {
  var user = req.body;
  console.log(user);
  if (!req.body.login || !req.body.password) {
    handleError(res, "donnees invalides", "Renseigner tous les champs", 400);
  } else {
    db.collection(USERS_COLLECTION).findOne({ login: req.body.login }, function (err, doc) {
      if (err) throw err;
      if (doc) {
        console.log("Found: " + req.body.login);
        if (sha256(req.body.password) === doc.password) {
          console.log("ok !");
          res.status(200).json(doc);
        }
        else {
          console.log("refused !");
        }
      }
      else
        console.log("Not found: " + req.body.login);

    });
  }
});


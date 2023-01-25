const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = "mongodb://127.0.0.1:27017/";

exports.listeGet = async function(req, res) {
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        let datas = await dbo.collection("listes").find({}).toArray();
        res.status(200).json(datas);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
};

exports.listePost = async function(req, res, next) {
    let tache = req.body;
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        await dbo.collection("listes").insertOne(tache);
        res.status(200).json(tache);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
};

exports.listeDelete = async function(req, res, next) {
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        let liste = await dbo.collection("listes").find({ _id: new mongodb.ObjectId(req.params.id) }).toArray();
        await dbo.collection("listes").deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
        res.status(200).json(liste);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
};
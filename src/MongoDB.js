const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = "mongodb://localhost:27017/quicknotes";
//const url = "mongodb+srv://cbpodd:1yFNfus7yipU3xMd@quicknotesmongodb-9lqnf.mongodb.net/test?retryWrites=true";

module.exports = class MongoDB {
  
  static addNote(note, callback) {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log("Connection Error");
        throw err;
      }

      let dbo = db.db("quicknotes");
      dbo.collection("notes").insertOne(note, (err, res) => {
        if (err) {
          console.log("Insertion Error");
          throw err;
        }
        db.close();
        callback(res.insertedId);
      });
    });
  } 

  static getNote(id, callback) {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log("Connection Error");
        throw err;
      }
      let dbo = db.db("quicknotes");
      dbo.collection("notes").findOne({"_id": ObjectID(id)}).toArray((err, res) => {
        if (err) {
          console.log("Error Finding Notes")
          throw err;
        }
        db.close();
        callback(res);
      });
    });
  }

  static getAllNotes(callback) {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log("Connection Error");
        throw err;
      }
      let dbo = db.db("quicknotes");
      dbo.collection("notes").find({}).sort({"time.month": -1, "time.day": -1,
         "time.hours": -1, "time.minutes": -1, "time.seconds": -1, 
         "time.milliseconds": -1 }).toArray((err, res) => {
        if (err) {
          console.log("Error Finding Notes")
          throw err;
        }
        db.close();
        callback(res);
      });
    });
  }

  static getNotes(query, callback) {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log("Connection Error");
        throw err;
      }
      let dbo = db.db("quicknotes");
      dbo.collection("notes").find(query).sort({"time.month": -1, "time.day": -1,
      "time.hours": -1, "time.minutes": -1, "time.seconds": -1, 
      "time.milliseconds": -1 }).toArray((err, res) => {
        if (err) {
          console.log("Error Finding Notes")
          throw err;
        }
        db.close();
        callback(res);
      });
    });
  }

  static deleteNote(id) {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log("Connection Error");
        throw err;
      }
      let dbo = db.db("quicknotes");
      dbo.collection("notes").deleteOne({"_id": ObjectID(id)}, (err, res) => {
        if (err) {
          console.log("Error Deleting Notes")
          throw err;
        }
        db.close();
      });
    });
  }

  static updateNote(id, newvalues) {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.error("Connection Error")
        throw err;
      }
      let dbo = db.db("quicknotes");
      console.log(ObjectID(id));
      dbo.collection("notes").updateOne({"_id": ObjectID(id)}, { $set: newvalues }, (err, res) => {
        if (err) {
          console.error("Update Error");
          throw err;
        }
        console.log(res.result);
        db.close();
      });
    });
  }
}
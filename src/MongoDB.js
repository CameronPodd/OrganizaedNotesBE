/**
 * @file MongoDB.js
 * @author Cameron Podd
 * @class MongoDB
 * @description A simple interface hiding the details of calling my MongoDB
 * and returning the results.  
 */

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// URL of my Mongo DB Atlas Database
const url = "mongodb+srv://cbpodd:1yFNfus7yipU3xMd@quicknotesmongodb-9lqnf.mongodb.net/quicknotes?retryWrites=true";

module.exports = class MongoDB {
  
  /**
   * @description Adds note to the Database and passes the inserted ID to the
   * callback function
   * @param {JSON} note Note to be added to the database.
   * @param {function} callback Callback function to be called with the inserted
   * Id.
   */
  static addNote(note, callback) {
    // Connects to the database
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log("Connection Error");
        throw err;
      }
    
      let dbo = db.db("quicknotes");
      // Insert note into the database
      dbo.collection("notes").insertOne(note, (err, res) => {
        if (err) {
          console.log("Insertion Error");
          throw err;
        }
        db.close();
        // Call the callback function
        callback(res.insertedId);
      });
    });
  } 

  /**
   * @description Gets a single note from the database and passes it to the
   * callback function.
   * @param {string} id _id of the single note to get from the database.
   * @param {Function} callback Callback function to call with the note.
   */
  static getNote(id, callback) {
    // Connect to the database
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log("Connection Error");
        throw err;
      }

      let dbo = db.db("quicknotes");
      // Find the note with _id = id
      dbo.collection("notes").findOne({"_id": ObjectID(id)}, (err, res) => {
        if (err) {
          console.log("Error Finding Notes")
          throw err;
        }
        db.close();

        // Call the callback function
        callback(res);
      });
    });
  }

  /**
   * @description Gets all notes in the database and returns them to the
   * callback function.
   * @param {Function} callback The function the notes are passed into.
   */
  static getAllNotes(callback) {
    // Connect to the database
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log("Connection Error");
        throw err;
      }

      let dbo = db.db("quicknotes");
      // Find all notes in the database
      dbo.collection("notes").find({}).sort({"time.month": -1, "time.day": -1,
         "time.hours": -1, "time.minutes": -1, "time.seconds": -1, 
         "time.milliseconds": -1 }).toArray((err, res) => {
        if (err) {
          console.log("Error Finding Notes")
          throw err;
        }
        db.close();

        // Call the callback function
        callback(res);
      });
    });
  }

  /**
   * @description Get all notes matching a specific query and pass them to the
   * callback function.
   * @param {JSON} query The query to be matched.
   * @param {Function} callback The function the results are passed to.
   */
  static getNotes(query, callback) {
    // Connect to the database
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log("Connection Error");
        throw err;
      }

      let dbo = db.db("quicknotes");
      // Find all notes and order them by time decreasing
      dbo.collection("notes").find(query).sort({"time.month": -1, "time.day": -1,
      "time.hours": -1, "time.minutes": -1, "time.seconds": -1, 
      "time.milliseconds": -1 }).toArray((err, res) => {
        if (err) {
          console.log("Error Finding Notes")
          throw err;
        }
        db.close();

        // Call the callback function
        callback(res);
      });
    });
  }

  /**
   * @description Deletes a note with _id = id
   * @param {string} id The _id of the note to be deleted.
   */
  static deleteNote(id) {
    // Connect to the database
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log("Connection Error");
        throw err;
      }

      let dbo = db.db("quicknotes");
      // Delete the note with _id = id
      dbo.collection("notes").deleteOne({"_id": ObjectID(id)}, (err, res) => {
        if (err) {
          console.log("Error Deleting Notes")
          throw err;
        }
        db.close();
      });
    });
  }

  /**
   * @description Updates note with _id = id with the new values.
   * @param {string} id The _id of the note to be updated.
   * @param {JSON} newvalues The new values to update the note with.
   */
  static updateNote(id, newvalues) {
    // Connect to the database
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.error("Connection Error")
        throw err;
      }
      
      let dbo = db.db("quicknotes");
      // Update the note
      dbo.collection("notes").updateOne({"_id": ObjectID(id)}, { $set: newvalues }, (err, res) => {
        if (err) {
          console.error("Update Error");
          throw err;
        }
        db.close();
      });
    });
  }
}
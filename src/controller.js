/**
 * @file controller.js
 * @author Cameron Podd
 * @description A RESTful API regarding quick notes
 * @URL https://leftorganizednotesbe.appspot.com/api
 */

 // Imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoDB = require('./MongoDB');

// Some starter responses
const OK200 = {
  cod: 200,
  msg: "Success"
};

const ISE500 = {
  cod: 500,
  msg: "Internal Server Error"
}

/**
 * @class Controller
 * @description Controller of the QuickNotes RESTful API
 */
class Controller {

  /**
   * @description Constructs the API, adds the endpoints, and gets it ready
   * to run.
   * @param {Express} app The express app to run off of.
   * @param {Integer} port The port to host the app on.
   */
  constructor(app, port) {
    // Configure the express app.
    app.use(bodyParser.json());
    app.use(cors());

    this.port = port;

    // Add all GET endpoints
    this.addGet(app);

    // Add all POST endpoints
    this.addPost(app);

    // Add all PUT endpoints
    this.addPut(app);

    // Add all DELETE endpoints
    this.addDelete(app);

  }

  /**
   * @description Add a few GET http endpoints to the Express app.
   * @endpoint /api/cards
   * @endpoint /api/cards/date
   * @endpoint /api/cards/:id
   * @param {Express} app The Express App whose get method I am adding.
   */
  addGet(app) {
    // Add Get by Date Method
    app.get('/api/cards/date', (req, res) => {
      // Get the Parameters from the URL
      let sm = parseInt(req.query.startMonth);
      let em = parseInt(req.query.endMonth);
      let sd = parseInt(req.query.startDay);
      let ed = parseInt(req.query.endDay);

      // Set Query Parameters
      let query = {};

      query["time.month"] = {
        $gte: sm,
        $lte: em
      };
      query["time.day"] = {
        $gte: sd,
        $lte: ed
      };

      try {
        // Get the notes from the database
        MongoDB.getNotes(query, (result) => {  
        let jsonres = OK200;
          // Return the notes
          jsonres["cards"] = result;
          res.json(jsonres);
        })
      } catch (err) {
        res.json(ISE500);
      }
    });

    // Add Get All Cards Method
    app.get('/api/cards', (req, res) => {
      try {
        // Get all notes from the database
        MongoDB.getAllNotes((result) => {
          // Return the Notes
          let jsonres = OK200;
          jsonres["cards"] = result;
          res.json(jsonres);
        })
      } catch (err) {
        res.json(ISE500);
      }
    });

    // Add Get by id method
    app.get('/api/cards/:id', (req, res) => {
      try {
        // Get the note from the database
        MongoDB.getNote(req.params.id, (result) => {
          // Return the result
          let jsonres = OK200;
          jsonres["cards"] = result;
          res.json(jsonres);
        });
      } catch (err) {
        res.json(ISE500);
      }
    });
  }

  /**
   * @description Adds a POST http method to app.
   * @endpoint POST /api/cards
   * @param {Express} app The app to add a post method to.
   */
  addPost(app) {
    // Add the endpoint to app
    app.post('/api/cards', (req, res) => {

      // Get the parameters from req
      let note = this.getPutPostParams(req);

      console.log(note);

      try {
        // Add a note to the database
        MongoDB.addNote(note, (id) => {
          // Respond with the _id of the added note
          let resBody = OK200;
          resBody["insertedId"] = id;
          res.json(resBody);
        });
      } catch (err) {
        res.json(ISE500);
      }
    });
  }

  /**
   * @description Adds a PUT http endpoint to the Express App.
   * @endpoint PUT /api/cards/:id
   * @param {Express} app The Express App on which the put method is being
   * added
   */
  addPut(app) {
    // Add the endpoint to express
    app.put('/api/cards/:id', (req, res) => {
      let id = req.params.id;

      // Get the parameters from the request
      let note = this.getPutPostParams(req);

      try {
        // Update the note
        MongoDB.updateNote(id, note);

        // Send a JSON Response
        res.json(OK200);
      } catch (err) {
        res.json(ISE500);
      }
    });
  }

  /**
   * @description Adds a DELETE HTTP method to the app.
   * @endpoint DELETE /api/cards/:id
   * @param {Express} app The express app the delete method will be added to.
   */
  addDelete(app) {
    // Add a delete method at the endpoint
    app.delete('/api/cards/:id', (req, res) => {
      let id = req.params.id;

      try {
        // Delete the node
        MongoDB.deleteNote(id);

        // Send a json response
        res.json(OK200);
      } catch (err) {
        // Send a response stating that an Internal Server Error has occured
        res.json(ISE500);
      }
    });
  }

  /**
   * @description Starts the server on this.port.
   */
  runApp() {
    app.listen(port, () => {
      console.log(`Quick Notes API running on port ${port}!`);
      console.log('press CTRL+C to exit');
    });
  }

  /**
   * @description Gets all parameters from the Request object and puts them
   * into a JSON ready to be inserted into the database.  
   * @param {Request} req Request object holding the parameters in the body
   * @returns {JSON} Returns a JSON of all of the parameters in the request
   */
  getPutPostParams(req) {
    // Create empty JSON Object
    let note = {};
    // Add a title (if it exists)
    if (req.body.title) {
      note["title"] = req.body.title;
    }

    // Add a body (if it exists)
    if (req.body.body) {
      note["body"] = req.body.body;
    }

    // Add all existing time parameters
    if (req.body.time) {
      note["time"] = {};
      if (req.body.time.year) {
        note["time"]["year"] = req.body.time.year;
      }
      if (req.body.time.month != undefined) {
        note["time"]["month"] = req.body.time.month;
      }
      if (req.body.time.day) {
        note["time"]["day"] = req.body.time.day;
      }
      if (req.body.time.hours != undefined) {
        note["time"]["hours"] = req.body.time.hours;
      }
      if (req.body.time.minutes) {
        note["time"]["minutes"] = req.body.time.minutes;
      }
      if (req.body.time.seconds) {
        note["time"]["seconds"] = req.body.time.seconds;
      }
      if (req.body.time.milliseconds) {
        note["time"]["milliseconds"] = req.body.time.milliseconds;
      }
    }

    // Add links (if they exist)
    if (req.body.links) {
      note["links"] = req.body.links;
    }

    // Return the now-full object
    return note;
  }
}
    
// State some constants
const app = express();
const port = 8080;

// Create the Server's controller
const cont = new Controller(app, port);

// Start the server
cont.runApp();
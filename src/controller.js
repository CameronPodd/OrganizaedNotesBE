/** @file controller.js */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoDB = require('./MongoDB');

class Controller {
  constructor(app, port) {

    app.use(bodyParser.json());
    app.use(cors());

    this.port = port;

    this.OK200 = {
      cod: 200,
      msg: "Success"
    };

    this.ISE500 = {
      cod: 500,
      msg: "Internal Server Error"
    }

    this.addGet(app);

    this.addPost(app);

  }

  addGet(app) {
    app.get('/cards', (req, res) => {
      let jsonres = this.OK200;
      jsonres["cards"] = {
        today: [],
        yesterday: [],
        week: [],
        month: [],
        year: [],
        old: []
      };
      res.contentType = "application/json";
      res.send(JSON.stringify(jsonres));
    });
  }

  addPost(app) {
    app.post('/cards', (req, res) => {
      let note = {
        title: req.body.title,
        body: req.body.body,
        "time": {
          "month": req.body.time.month,
          "day": req.body.time.day,
          "hours": req.body.time.hours,
          "minutes": req.body.time.minutes,
          "seconds": req.body.time.seconds,
          "milliseconds": req.body.time.milliseconds
        }
      };

      res.contentType = "application/json";

      let resBody = this.OK200;

      MongoDB.addNote(note, (id) => {
        resBody["insertedId"] = id;
        res.send(JSON.stringify(resBody));
      });
    });
  }

  runApp() {
    app.listen(port, () => {
      console.log(`App listening on port ${port}!`);
      console.error('press CTRL+C to exit');
    });
  }
}
    
const app = express();
const port = 8000;
const cont = new Controller(app, port);

cont.runApp();
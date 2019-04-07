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

    this.addPut(app);

    this.addDelete(app);

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
        },
        links: req.body.links
      };

      res.contentType = "application/json";

      let resBody = this.OK200;

      MongoDB.addNote(note, (id) => {
        resBody["insertedId"] = id;
        res.send(JSON.stringify(resBody));
      });
    });
  }

  addPut(app) {
    app.put('/cards/:id', (req, res) => {
      let id = req.params.id;

      let note = this.getParams(req);

      MongoDB.updateNote(id, note);

      res.send(JSON.stringify(this.OK200));
    });
  }

  addDelete(app) {
    app.delete('/cards/:id', (req, res) => {
      let id = req.params.id;

      MongoDB.deleteNote(id);

      res.send(JSON.stringify(this.OK200));
    });
  }

  runApp() {
    app.listen(port, () => {
      console.log(`Quick Notes API running on port ${port}!`);
      console.error('press CTRL+C to exit');
    });

    MongoDB.getAllNotes((res) => {
      console.log(res);
    })
  }

  getParams(req) {
    let note = {};

    if (req.body.title) {
      note["title"] = req.body.title;
    }
    if (req.body.body) {
      note["body"] = req.body.body;
    }
    if (req.body.time) {
      if (req.body.time.month) {
        note["time"]["month"] = req.body.time.month;
      }
      if (req.body.time.day) {
        note["time"]["day"] = req.body.time.day;
      }
      if (req.body.time.hours) {
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
    if (req.body.links) {
      note["links"] = req.body.links;
    }

    return note;
  }
}
    
const app = express();
const port = 8000;
const cont = new Controller(app, port);

cont.runApp();
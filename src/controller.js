/** @file controller.js */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoDB = require('./MongoDB');

const OK200 = {
  cod: 200,
  msg: "Success"
};

const ISE500 = {
  cod: 500,
  msg: "Internal Server Error"
}

class Controller {
  constructor(app, port) {

    app.use(bodyParser.json());
    app.use(cors());

    this.port = port;



    this.addGet(app);

    this.addPost(app);

    this.addPut(app);

    this.addDelete(app);

  }

  addGet(app) {
    app.get('/cards', (req, res) => {
      let jsonres = OK200;
      res.contentType = "application/json";

      let sm = req.query.startMonth;
      let em = req.query.endMonth;
      let sd = req.query.startDay;
      let ed = req.query.endDay;
      let query = {};
      if (sm === -1) {
        query["month"] = {
          $lte: em,
        };
      } else {
        query["month"] = {
          $gte: sm,
          $lte: em,
        };
        query["day"] = {
          $gte: sd,
          $lte: ed
        };
      }

      MongoDB.getNotes(query, (result) => {
        jsonres["cards"] = result;
        res.send(JSON.stringify(jsonres));
      })
    });
  }

  addPost(app) {
    app.post('/cards', (req, res) => {
      let note = this.getPutPostParams(req);

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

      let note = this.getPutPostParams(req);

      MongoDB.updateNote(id, note);

      res.contentType = "application/json";

      res.send(JSON.stringify(OK200));
    });
  }

  addDelete(app) {
    app.delete('/cards/:id', (req, res) => {
      let id = req.params.id;

      MongoDB.deleteNote(id);

      res.contentType = "application/json";

      res.send(JSON.stringify(OK200));
    });
  }

  runApp() {
    app.listen(port, () => {
      console.log(`Quick Notes API running on port ${port}!`);
      console.log('press CTRL+C to exit');
    });

    MongoDB.getAllNotes((res) => {
      console.log(res);
    })
  }

  getPutPostParams(req) {
    let note = {};

    if (req.body.title) {
      note["title"] = req.body.title;
    }
    if (req.body.body) {
      note["body"] = req.body.body;
    }
    if (req.body.time) {
      note["time"] = {};
      if (req.body.time.year) {
        note["time"]["year"] = req.body.time.year;
      }
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
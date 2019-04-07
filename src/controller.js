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
    app.get('/api/cards/date', (req, res) => {
      let jsonres = OK200;

      let sm = parseInt(req.query.startMonth);
      let em = parseInt(req.query.endMonth);
      let sd = parseInt(req.query.startDay);
      let ed = parseInt(req.query.endDay);
      let query = {};

      query["time.month"] = {
        $gte: sm,
        $lte: em
      };
      query["time.day"] = {
        $gte: sd,
        $lte: ed
      };

      MongoDB.getNotes(query, (result) => {
        jsonres["cards"] = result;
        res.json(jsonres);
      })
    });

    app.get('/api/cards', (req, res) => {
      let jsonres = OK200;

      MongoDB.getAllNotes((result) => {
        jsonres["cards"] = result;
        res.json(jsonres);
      })
    });

    app.get('/api/cards/:id', (req, res) => {
      let jsonres = OK200;

      MongoDB.getNote(req.params.id, (result) => {
        jsonres["cards"] = result;
        res.json(jsonres);
      })
    })
  }

  addPost(app) {
    app.post('/api/cards', (req, res) => {
      let note = this.getPutPostParams(req);

      MongoDB.addNote(note, (id) => {
        let resBody = OK200;
        resBody["insertedId"] = id;
        res.json(resBody);
      });
    });
  }

  addPut(app) {
    app.put('/api/cards/:id', (req, res) => {
      let id = req.params.id;

      let note = this.getPutPostParams(req);

      MongoDB.updateNote(id, note);

      res.json(OK200);
    });
  }

  addDelete(app) {
    app.delete('/api/cards/:id', (req, res) => {
      let id = req.params.id;

      MongoDB.deleteNote(id);

      res.json(OK200);
    });
  }

  runApp() {
    app.listen(port, () => {
      console.log(`Quick Notes API running on port ${port}!`);
      console.log('press CTRL+C to exit');
    });
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
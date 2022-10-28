const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Organiser, Tournament, Match, Team, Player } = require('./db/models')
const Op = require('sequelize').Op
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions))


// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// const session = require('express-session');
// app.use(session({
//   secret: 'lkjfldsakjfi',
//   saveUninitialized: false,
//   resave: true,
//   cookie: {
//     secure: false,
//     // delete cookie after 15 minutes
//     maxAge: 15 * 60 * 1000,
//     rolling: true,
//   },
// }));


app.post('/create_account', (req, res) => {

  const task = async () => {
    try {
      const result = await Organiser.create(req.body)
      result.send(result)
    } catch (err) {
      console.error(err)
    }
  }
  task();
})

app.post('/authenticate', (req, res) => {
  const task = async () => {
    try {
      const user = await Organiser.findOne({
        attributes: [
          'username', 'password', 'name'
        ],
        where: {
          username: req.body.username
        }
      })
      res.send(user)
    }
    catch (err) {
      console.error(err)
    }
  }
  task();
})


/*_____ Tournament Management _____*/

app.get('/tournament', (req, res) => {
  let tournament_name = req.query.name

  if (tournament_name) {
    const task = async () => {
      try {

        const point_table = await Team.findAll({
          order: [
            ['point', 'DESC'],
            ['match', 'DESC'],
            ['name', 'ASC']
          ],
          where: {
            tournament_name: {
              [Op.eq]: tournament_name
            }
          }
        })

        const d = new Date()
        let curr_date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

        const past_match = await Match.findAll({
          order: [
            ['start_date', 'DESC'],
            ['start_time', 'DESC']
          ],
          where: {
            [Op.and]: {
              tournament_name: {
                [Op.eq]: tournament_name
              },
              winner: {
                [Op.ne]: null
              }
            }
          }
        })

        const present_match = await Match.findAll({
          where: {
            [Op.and]: {
              tournament_name: {
                [Op.eq]: tournament_name
              },
              start_date: {
                [Op.eq]: curr_date
              },
              winner: {
                [Op.eq]: null
              }
            }
          }
        })

        const future_match = await Match.findAll({
          order: [
            ['start_date', 'ASC']
          ],
          where: {
            [Op.and]: {
              tournament_name: {
                [Op.eq]: tournament_name
              },
              start_date: {
                [Op.gt]: curr_date
              }
            }
          }
        })
        res.send({ point_table, present_match, past_match, future_match, tournament_name })
      } catch (err) {
        console.error(err)
      }
    }
    task();
  }
  else {
    console.error("at /tournament")
  }
})

app.post('/tournament/create_tournament', (req, res) => {
  const task = async () => {
    try {
      const result = await Tournament.create(req.body)
      res.send(result)
    } catch (err) {
      console.error(err)
    }
  }
  task();
})

app.get('/tournament/create_match', (req, res) => {
  let tournament_name = req.query.tournament
  if (tournament_name) {
    const task = async () => {
      try {
        const team_list = await Team.findAll({
          where: {
            tournament_name: {
              [Op.eq]: tournament_name
            }
          }
        })
        res.send({ team_list, tournament_name })
      } catch (err) {
        console.error(err)
      }
    }
    task();
  }
  else {
    console.error("tournament_name not found");
  }
})

app.post('/tournament/create_match', (req, res) => {

  const task = async () => {
    try {
      console.log(req.body)
      const result = await Match.create(req.body)
      res.send(result)
    } catch (err) {
      console.error(err)
    }
  }
  task();
})

app.post('/tournament/add_team', (req, res) => {
  const task = async () => {
    try {
      const result = await Team.create(req.body)
      res.send(result);
    } catch (err) {
      console.error(err)
    }
  }
  task();
})

/*_____ Tournament Management End _____*/




/*_____ Team Management _____*/

app.get('/team', (req, res) => {
  let tid = req.query.tid;
  const task = async () => {
    try {
      const players = await Player.findAll({
        where: {
          tid: tid
        }
      })
      res.send({ players, tid })
    } catch (err) {
      console.error(err)
    }
  }
  task();
})

app.post('/team/add_player', (req, res) => {
  const task = async () => {
    try {
      const result = Player.create(req.body)
      res.send(result)
    } catch (err) {
      console.error(err)
    }
  }
  task();
})

/*_____ Team Management End _____*/

app.get('/', (req, res) => res.redirect('/home'));

app.get('/home', (req, res) => {
  const task = async () => {
    try {
      const d = new Date()

      let curr_date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();


      const present_tournament = await Tournament.findAll({
        order: [
          ['start_date', 'ASC'],
          ['prize', 'DESC']
        ],
        where: {

          start_date: {
            [Op.lte]: curr_date
          },
          end_date: {
            [Op.gte]: curr_date
          }
        },
        include: {
          model: Organiser,
          as: 'organiser',
          attributes: [
            'name'
          ]
        }
      })

      const past_tournament = await Tournament.findAll({
        order: [
          ['start_date', 'DESC'],
          ['prize', 'DESC']
        ],
        where: {

          end_date: {
            [Op.lt]: curr_date
          }

        },
        include: {
          model: Organiser,
          as: 'organiser',
          attributes: [
            'name'
          ]
        }
      })

      const future_tournament = await Tournament.findAll({
        order: [
          ['start_date', 'ASC'],
          ['prize', 'DESC']
        ],
        where: {
          start_date: {
            [Op.gt]: curr_date
          }
        },
        include: {
          model: Organiser,
          as: 'organiser',
          attributes: [
            'name'
          ]
        }
      })

      res.send({ present_tournament, future_tournament, past_tournament })
    } catch (err) {
      console.error(err)
    }
  }
  task();
})

app.get('/profile', (req, res) => {
  if (req.session.username) {
    const task = async () => {
      try {

        const tlist = await Tournament.findAll({
          order: [
            ['end_date', 'DESC'],
            ['prize', 'DESC'],
            ['start_date', 'DESC'],
          ],
          where: {
            username: req.session.username
          }

        })
        res.send({ tlist, user: req.session.name })

      } catch (err) {
        console.error(err)
      }
    }
    task();
  }
  else {
    res.redirect('/1/login')
  }
})


/*_____ Player Management _____*/
app.get('/player', (req, res) => {

  const task = async () => {
    try {
      const player = await Player.findAll({
        where: { pid: req.query.pid }
      })
      res.send({ player })
    } catch (err) {
      console.error(err)
    }
  }
  task();
})


/*_____ Player Management End _____*/


/*_____ Score Card Management _____*/



/*_____ Score Card Management End _____*/

module.exports = app;

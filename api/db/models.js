const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

// creating connection to database
const db = new Sequelize('db22', 'sudama', '22', {
    host: 'localhost',
    dialect: 'mysql'
})

const Organiser = db.define('organisers', {
    username: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    phoneno: {
        type: DataTypes.BIGINT(10),
        allowNull: false
    }

});

const Tournament = db.define('tournaments', {
    name: {
        type: DataTypes.STRING(40),
        allowNull: false,
        primaryKey: true
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    prize: {
        type: DataTypes.BIGINT(10),
        allowNull: false
    },

    village: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(40)
    }
});

Organiser.hasMany(Tournament, {
    foreignKey: 'username',
});

Tournament.belongsTo(Organiser, {
    foreignKey: 'username',
});

const Team = db.define('teams', {
    tid: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    match: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    win: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    loss: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    draw: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    point: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tournament_name: {
        type: DataTypes.STRING(40),
        allowNull: false
    }
});

Team.belongsTo(Tournament, {
    foreignKey: 'tournament_name',
});

const Player = db.define('players', {
    pid: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        default: 1
    },
    name: {
        type: DataTypes.STRING(40),
        allowNull: false
    },

    match: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    inning: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    run: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    ball: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    four: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    six: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    st_rate: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    avg: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    thirty: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    fifty: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    hundred: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    best: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    b_inning: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    b_ball: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    b_run: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    b_wicket: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    b_economy: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    b_avg: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    b_best: {
        type: DataTypes.STRING,
        defaultValue: "0/0"
    },
    tid: {
        type: DataTypes.BIGINT,
        allowNull: false
    }

});

Player.belongsTo(Team, {
    foreignKey: 'tid',
});

const Match = db.define('matches', {
    mid: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    team1: {
        type: DataTypes.BIGINT(10),
        allowNull: false
    },
    team2: {
        type: DataTypes.BIGINT(10),
        allowNull: false
    },
    winner: {
        type: DataTypes.BIGINT(10)
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    tournament_name: {
        type: DataTypes.STRING(40),
        allowNull: false
    }
});

Match.belongsTo(Tournament, {
    foreignKey: 'tournament_name',
});

// const Scorecard = db.define('scorecards', {
//     over: {

//     }
// });


// db.sync({ alter: true })
//     .then(() => console.log('Syncronized'))
//     .catch((err) => console.error(err))

module.exports = {
    db, Organiser, Tournament, Team, Player, Match
}
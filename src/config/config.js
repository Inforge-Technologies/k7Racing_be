// //Local credential

const config = {
     "database": {
          "host": "localhost",
          "port": 5432,
          "user": "postgres",
          "password": "root",
          "database": "k7_racing"
     },
     "pool": {
          "max": 5,
          "min": 0,
          "acquire": 30000,
          "idle": 10000
     }
};


//Production data base

// const config = {
//      database: {
//           host: "inforgetvk.cjsq2uu0sm16.eu-north-1.rds.amazonaws.com",
//           port: 5432,
//           user: "inforgetech",
//           password: "Inforge2026TVK",
//           database: "k71",
//      },
//      pool: {
//           max: 5,
//           min: 0,
//           acquire: 30000,
//           idle: 10000,
          
//      },
// }

module.exports = config;
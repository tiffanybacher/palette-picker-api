// const environment = process.env.NODE_ENV || 'development';
// const configuration = require('./knexfile')[environment];
// const database = require('knex')(configuration);
// const port = 3001;
// const express = require('express');
// const app = express();

// app.use(express.json());

const app = require('./app');

app.set('port', process.env.PORT || 3001);

app.listen(process.env.PORT || app.get('port'), () => {
  console.log(`Palette Picker is running on ${app.get('port')}.`);
});

module.exports = app;
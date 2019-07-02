const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      response.status(200).json(palettes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const id = request.params.id;

  database('palettes').where({ id }).select()
    .then(palette => {
      if (palette.length) {
        response.status(200).json(palette[0]);
      } else {
        response.status(404).json({ error: `A palette with id of ${id} was not found.` });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const id = request.params.id;

  database('palettes').where({ id }).del()
    .then(deleted => {
      if (!deleted) {
        response.sendStatus(202);
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  const id = request.params.id;
  
  database('projects').where({ id }).select()
    .then(project => {
      if (project.length) {
        response.status(200).json(project[0]);
      } else {
        response.status(404).json({ error: `Project with id of ${id} was not found.` });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.patch('/api/v1/projects/:id', (request, response) => {
  const id = request.params.id;
  const { name } = request.body;

  database('projects').where({ id }).update({ name })
    .then(count => {
      if (count) {
        response.sendStatus(204);
      } else {
        response.sendStatus(202);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/projects/:id', (request, response) => {
  const id = request.params.id;

  database('projects').where({ id }).del()
    .then(deleted => {
      if (!deleted) {
        response.sendStatus(202);
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

module.exports = app;
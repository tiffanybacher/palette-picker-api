const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/v1/palettes', (request, response) => {    
  const palette = request.body    
  for (let param of [ 'name', 'colors_array', 'project_id']) {    
    if (!palette[param]) {    
      response.status(422).json({ error: 'Expected Format: body = { name: <string>, colors_array: <array>, project_id: <number> ' });    
    };    
  };    
  database('palettes').insert(request.body, 'id')    
  .then(id => {    
    response.status(201).json({ id: id[0] });    
  })    
  .catch(error => {    
    response.status(500).json({ error });    
  });    
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select('id', 'name', 'colors_array', 'project_id')
    .then(palettes => {
      response.status(200).json(palettes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const id = request.params.id;

  database('palettes').where({ id }).select('id', 'name', 'colors_array', 'project_id')
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

app.put('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  const paletteItem = request.body;

  for (let param of ['name', 'colors_array', 'project_id']) {
    if (!paletteItem[param]) {
      return response.status(422).json({ error: `Expected format: body = { name: <string>, colors_array: <array> }. You are missing a ${param} param.` })
    }
  }

  database('palettes').where({ id }).update({ ...paletteItem })
    .then(count => {
      if (count) {
        database('palettes')
          .where({ id })
          .first('id', 'name', 'colors_array', 'project_id')
          .then(palette => {
            response.status(200).json(palette);
          })
          .catch(error => {
            response.status(500).json({ error })
          });
      } else {
        response.status(404).send({ error: `Palette with id of ${id} could not be found.` });
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

app.post('/api/v1/projects', (request, response) => {    
  const project = request.body    
  for (let param of [ 'name' ]) {    
    if (!project[param]) {    
      return response.status(422).json({ error: 'Expected Format: body = { name: <string>' });    
    };    
  };    
  database('projects').insert(request.body, 'id')    
  .then(ids => {    
    response.status(201).json({ id: ids[0] });    
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

app.put('/api/v1/projects/:id', (request, response) => {
  const id = request.params.id;
  const { name } = request.body;

  if (!name) {
    return response
      .status(422)
      .json({ error: 'Expected format: body = { name: <string> }. You are missing a name.' });
  }

  database('projects').where({ id }).update({ name })
    .then(count => {
      if (count) {
        response.status(200).json({ id, name });
      } else {
        response.status(404).json({ error: `Project with id of ${id} was not found.` });
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

app.post('/api/v1/users', (request, response) => {
  const user = request.body;

  for (let param of ['username', 'password']) {
    if (!user[param]) {
      return response.status(422).json({ error: `Expected body to = { username: <string>, password: <string> }. Body is missing a '${param}' param.` });
    } 
  }

  database('users').where({ username: user.username }).first()
    .then(user => {
      if (user) {
        return response.status(409).json({ error: `Resource already exists with username of '${user.username}'.` });
      }
    });

  database('users').insert(user, 'id')
    .then(user => {
      response.status(201).json({ id: user[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/users/:username', (request, response) => {
  const username = request.params.username;

  database('users').where({ username }).first()
    .then(user => {
      if (user) {
        response.status(200)
          .json({ 
            id: user.id, 
            username: user.username 
          });
      } else {
        response.status(404).json({ error: `No user with the username of ${username} was found.` });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

module.exports = app;

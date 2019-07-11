const request = require('supertest');
const app = require('./app');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe('GET /api/v1/palettes', () => {
    it('should return all the palettes from the database with a status of 200', async () => {
      const response = await request(app).get('/api/v1/palettes');
      const palettes = response.body;
      const expected = await database('palettes').select('id', 'name', 'colors_array', 'project_id');

      expect(palettes).toEqual(expected);
      expect(response.status).toEqual(200);
    });

    it('should return all the palettes from the database with the correct project_id', async () => {
      const { project_id } = await database('palettes').first();
      const response = await request(app).get(`/api/v1/palettes?project_id=${project_id}`);
      const expected = await database('palettes').where({ project_id }).select('id', 'name', 'colors_array', 'project_id');

      expect(response.body).toEqual(expected);
      expect(response.status).toEqual(200);
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('should respond with a status of 422 and appropriate message', async () => {
      const requestBody = {};
      const response = await request(app).post('/api/v1/palettes').send(requestBody);
      const expectedError = { error: `Expected Format: body = { name: <string>, colors_array: <array>, project_id: <number> ` };

      expect(response.body).toEqual(expectedError);
      expect(response.status).toEqual(422);
    });

    it('should respond with a status of 201 and new id', async () => {
      const project_id = await database('projects').first('id');
      const requestBody = {
        name: 'Tiff',
        colors_array: [],
        project_id: project_id.id
      };
      const response = await request(app).post('/api/v1/palettes').send(requestBody);
      const ids = await database('palettes').where('name', 'Tiff').select('id');

      expect(response.body.id).toEqual(ids[0].id);
      expect(response.status).toEqual(201);
    });
  });

  describe('GET /api/v1/palettes/:id', () => {
    it('should return a single palette with an id that matches the param id', async () => {
      const expectedPalette = await database('palettes').first('id', 'name', 'colors_array', 'project_id');
      const { id } = expectedPalette;
      const response = await request(app).get(`/api/v1/palettes/${id}`);
      const { body, status } = response;

      expect(body).toEqual(expectedPalette);
      expect(status).toEqual(200);
    });
    
    it('should return a 404 and a appropriate message if no palette is found', async () => {
      const id = -1;
      const expectedError = { error: `A palette with id of ${id} was not found.` }
      const response = await request(app).get(`/api/v1/palettes/${id}`);

      expect(response.body).toEqual(expectedError);
    });
  });

  describe('PUT /api/v1/palettes/:id', () => {
    let palette;
    let id;
    let response;
    let requestBody;

    beforeEach(async () => {
      palette = await database('palettes')
        .first('id', 'name', 'colors_array', 'project_id');
      id = palette.id;
      requestBody = {
        id: palette.id,
        name: 'Max Silver',
        colors_array: [],
        project_id: palette.project_id
      }
    });

    it('should update a palette with an id matching the id in the request params', async () => {
      const response = await request(app)
        .put(`/api/v1/palettes/${id}`)
        .send(requestBody);
      const updatedPalette = response.body;

      expect(updatedPalette).toEqual(requestBody);
      expect(response.status).toEqual(200);
    });

    it('should send an error and status of 422', async () => {
      requestBody = {
        id: palette.id,
        name: 'Max Silver'
      }
      const response = await request(app)
        .put(`/api/v1/palettes/${id}`)
        .send(requestBody);
      const expectedError = { error: `Expected format: body = { name: <string>, colors_array: <array> }. You are missing a colors_array param.` }

      expect(response.body).toEqual(expectedError);
      expect(response.status).toEqual(422);
    });

    it('should return a 404 and an appropriate message', async () => {
      id = id - 1;
      const response = await request(app)
        .put(`/api/v1/palettes/${id}`)
        .send(requestBody);
      const expectedError = { error: `Palette with id of ${id} could not be found.` }

      expect(response.body).toEqual(expectedError);
      expect(response.status).toEqual(404);
    });
  });

  describe('DELETE /api/v1/palettes/:id' ,() => {
    it('should respond with a status of 204 when something is successfully deleted', async () => {
      const palette = await database('palettes').first('id');
      const { id } = palette
      const response = await request(app).delete(`/api/v1/palettes/${id}`);

      expect(response.status).toEqual(204);
    });
    it('should response with a status of 200 and appropriate message when id is not found', async () => {
      const { id } = await database('palettes').first('id');
      const response = await request(app).delete(`/api/v1/palettes/${id - 1}`);

      expect(response.status).toEqual(202);
    });
  });

  describe('GET /api/v1/projects', () => {
    it('Should return all of the projects', async () => {
      const expectedProjects = await database('projects').select('id', 'name', 'user_id')
      const response = await request(app).get('/api/v1/projects');

      expect(response.body).toEqual(expectedProjects);
      expect(response.status).toEqual(200);
    });

    it('should return all the projects from the database with the correct user_id', async () => {
      const { user_id } = await database('projects').first();
      const response = await request(app).get(`/api/v1/projects?user_id=${user_id}`);
      const expected = await database('projects').where({ user_id }).select('id', 'name', 'user_id');

      expect(response.body).toEqual(expected);
      expect(response.status).toEqual(200);
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should respond with a status of 422 and appropriate message', async () => {
      const requestBody = {};
      const response = await request(app).post('/api/v1/projects').send(requestBody);
      const expectedError = { error: 'Expected Format: body = { name: <string>, user_id: <number> }' };

      expect(response.body).toEqual(expectedError);
      expect(response.status).toEqual(422);
    });

    it('should respond with a status of 201 and new id', async () => {
      const { id } = await database('users').first('id');
      const requestBody = {
        name: 'Tiff',
        user_id: id
      };
      const response = await request(app).post('/api/v1/projects').send(requestBody);
      const ids = await database('projects').where('name', 'Tiff').select('id');

      expect(response.body).toEqual(ids[0]);
      expect(response.status).toEqual(201);
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return the correct project and a status of 200', async () => {
      const expectedProject = await database('projects').first('id', 'name', 'user_id');
      const id = expectedProject.id;
      const response = await request(app).get(`/api/v1/projects/${id}`);

      expect(response.body).toEqual(expectedProject);
      expect(response.status).toEqual(200);
    });

    it('should return a status of 404 and the appropriate error message',  async () => {
      const { id } = await database('projects').first('id');
      const response = await request(app).get(`/api/v1/projects/${id - 1}`);
      const expectedError = { error: `Project with id of ${id - 1} was not found.` };

      expect(response.body).toEqual(expectedError);
      expect(response.status).toEqual(404);
    });
  });

  describe('PUT /api/v1/projects/:id', () => {
    it('should return a status of 422 and the appropriate message', async () => {
      const id = await database('projects').first('id').id;
      const requestBody = {};
      const response = await request(app).put(`/api/v1/projects/${id}`).send(requestBody);
      const expectedError = { error: 'Expected format: body = { name: <string> }. You are missing a name.' };

      expect(response.status).toEqual(422);
      expect(response.body).toEqual(expectedError);
    });

    it('should return a status of 200 and the project edited', async () => {
      const project = await database('projects').first();
      const update = { name: 'Poster' };
      const response = await request(app).put(`/api/v1/projects/${project.id}`).send(update);
      const updatedProjects = await database('projects').where('id', project.id).select('id', 'name');

      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual(updatedProjects[0].name);
    });

    it('should return a status of 404 and the appropriate message', async () => {
      const { id } = await database('projects').first('id');
      const requestBody = { name: 'Poster' };
      const response = await request(app).put(`/api/v1/projects/${id - 1}`).send(requestBody);
      const expectedError = { error: `Project with id of ${id - 1} was not found.` };

      expect(response.status).toEqual(404);
      expect(response.body).toEqual(expectedError);
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should return a status of 202', async () => {
      const { id } = await database('projects').first('id');
      const response = await request(app).delete(`/api/v1/projects/${id - 10}`);
      const { status, body } = response;

      expect(status).toEqual(202);
    });

    it('should return a status of 204 on successful deletion', async () => {
      const { id } = await database('projects').first('id');
      const response = await request(app).delete(`/api/v1/projects/${id}`);

      expect(response.status).toEqual(204);
    });
  });

  describe('POST /api/v1/users', () => {
    let user;

    beforeEach(() => {
      user = {
       username: 'brennan',
       password: 'password'
      } 
    });

    it('should respond with a 422 and message if body is missing a param', async () => {
      user = {};
      const response = await request(app).post('/api/v1/users').send(user);
      const expectedError = { error: `Expected body to = { username: <string>, password: <string> }. Body is missing a 'username' param.` };

      expect(response.body).toEqual(expectedError);

      expect(response.status).toEqual(422);
    });

    it.skip('should respond with a 409 error  if username already exists', async () => {
      const response = await request(app).post('/api/v1/users').send(user);
      const expectedError = { error: `Resource already exists with username of 'brennan'.` };

      expect(response.status).toEqual(409);
    });

    it('should respond with a 201 and the user info if successful', async () => {
      const response = await request(app).post('/api/v1/users').send(user);
      const expectedResponse = {
        id: response.body.id,
        username: 'brennan'
      };

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('GET /api/v1/users/login', () => {
    beforeEach(async () => {
      const user = {
        username: 'tiffanybacher',
        password: 'password'
      }

      await request(app).post('/api/v1/users').send(user);
    });

    it('should return a 404 if the username is not found' , async () => {
      const username = 'tiff';
      const password = 'northwest';
      
      const response = await request(app).get(`/api/v1/users/${username}/${password}`);
      
      expect(response.status).toEqual(404);
    });

    it('should return a 422 with a message if the password does not match', async () => {
      const { username, password } = await database('users').first();
      const response = await request(app).get(`/api/v1/users/${username}/${password}`);
     
      expect(response.status).toEqual(422);
    });

    it.skip('should return a 200 and return the user id and username', async () => {
      const username = 'tiffanybacher';
      const password = 'password';
      const response = await request(app).get(`/api/v1/users/${username}/${password}`);
      const expectedResponse = {
        id: response.body.id,
        username
      }

      expect(response.body).toEqual(expectedResponse);
    });
  });
});

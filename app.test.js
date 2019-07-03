const request = require('supertest');
const app = require('./app');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {
  describe('GET /api/v1/palettes', () => {
    it('should return all the palettes from the database with a status of 200', async () => {
      const response = await request(app).get('/api/v1/palettes');
      const palettes = response.body;
      const expected = await database('palettes').select('id', 'name', 'colors_array', 'project_id');

      expect(palettes).toEqual(expected);
      expect(response.status).toEqual(200);
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
});

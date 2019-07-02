const request = require('supertest');
const app = require('./app');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {
  it('should be true', () => {
    expect(true).toEqual(true);
  });
});

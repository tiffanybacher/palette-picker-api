const seedData = require('../../../seed-data');
const projectData = seedData.projects;
const userData = seedData.users;

const createUser = (knex, user) => {
  return knex('users').insert({
    username: user.username,
    password: user.password
  }, 'id')
  .then(userId => {
    let projectPromises = [];
      
    projectData.forEach(project => {
      projectPromises.push(createProject(knex, project, userId[0]));
    });

    return Promise.all(projectPromises);
  });
}

const createProject = (knex, project, userId) => {
  return knex('projects').insert({
    name: project.name,
    user_id: userId
  }, 'id')
  .then(projectId => {
    let palettePromises = [];

    project.palettes.forEach(palette => {
      palettePromises.push(createPalette(knex, palette, projectId[0]));
    });

    return Promise.all(palettePromises);
  });
}

const createPalette = (knex, palette, projectId) => {
  return knex('palettes').insert({ 
    name: palette.name,
    colors_array: palette.colors,
    project_id: projectId
  });
}

exports.seed = function(knex) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => knex('users').del())
    .then(() => {
      let userPromises = []; 

      userData.forEach(user => {
        userPromises.push(createUser(knex, user))
      });
  
      return Promise.all(userPromises);
    })
    .catch(error => console.log(`Error in seeding data. ${error}`));
};

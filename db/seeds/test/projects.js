const seedData = require('../../../seed-data');
const projectData = seedData.projects;
const userData = seedData.user;

const createProject = (knex, project, userID) => {
  return knex('projects').insert({
    name: project.name,
    user_id: userID
  }, 'id')
    .then(projectId => {
      let palettePromises = [];

      project.palettes.forEach(palette => {
        palettePromises.push(createPalette(knex, { 
          name: palette.name,
          colors_array: palette.colors,
          project_id: projectId[0]
        }));
      });

      return Promise.all(palettePromises);
    });
}

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
}

exports.seed = function(knex) {
  let userID;

  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => knex('users').del())
    .then(() => {
      const userPromise = knex('users').insert({
        username: userData.username,
        password: userData.password
      }, 'id')
      .then(ID => userID = ID[0])
      
      return Promise.resolve(userPromise);
    })
    .then(() => {
      let projectPromises = [];
      
      projectData.forEach(project => {
        projectPromises.push(createProject(knex, project, userID));
      });

      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`Error in seeding data. ${error}`));
};

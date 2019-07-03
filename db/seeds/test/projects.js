const projectData = require('../../../seed-data');

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name
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
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];

      projectData.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });

      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`Error in seeding data. ${error}`));
};

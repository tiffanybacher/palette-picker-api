
exports.up = function(knex) {
  return Promise.all([
    knex.schema.alterTable('palettes', table => {
      table.specificType('colors_array', 'TEXT ARRAY').alter();
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.alterTable('palettes', table => {
      table.string('colors_array').alter();
    })
  ]);
};


exports.up = function(knex) {
  return Promise.resolve(
    knex.schema.alterTable('users', table => {
      table.string('username').unique().alter();
    })
  );
};

exports.down = function(knex) {
  return Promise.resolve(
    knex.schema.alterTable('users', table => {
      table.string('username').alter();
    })
  );
};

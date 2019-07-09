
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('username');
      table.string('password');
    }),

    knex.schema.alterTable('projects', table => {
      table.integer('user_id').unsigned();
      table.foreign('user_id')
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.alterTable('projects', table => {
      table.dropColumn('user_id')
    })
  ]);
};

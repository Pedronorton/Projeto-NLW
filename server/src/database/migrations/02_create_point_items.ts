import Knex from 'knex'

export async function up(knex: Knex){ //knex com o tipo Knex
    //criar tabela
    return knex.schema.createTable('poits_items', table => {
        table.increments('id').primary();
        table.integer('point_id') // faz o relacionamento
        .notNullable()
        .references('id')
        .inTable('points')

        table.integer('item_id')
        .notNullable()
        .references('id')
        .inTable('points');

    })
}

export async function down(knex: Knex){
    //VOLTAR ATRAS - deletar tabela
    return knex.schema.dropTable('poits_items')
}
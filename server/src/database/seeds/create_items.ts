import Knex from 'knex'

export async function seed(knex: Knex){
    await knex('items').insert([
        {title: 'Lampadas', image:'eco.svg'},
        {title: 'Pilhas e Baterias', image:''},
        {title: 'Papéis e Papelão', image:''},
        {title: 'Resíduos Eletrônicos', image:''},
        {title: 'Resíduos Orgânicos', image:''},
        {title: 'Óleo de cozinha', image:''},
    ])
} 
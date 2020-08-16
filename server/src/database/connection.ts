import knex from 'knex'
import path from 'path'

const connection = knex({
    client: 'sqlite3', // qual bd irei usar
    connection: {
        filename: path.resolve(__dirname,'database.sqlite' )   //dirname retorna o caminho para o diretorio que quero
    },
    useNullAsDefault: true
})

export default connection

//MIGRATION do knex é um histórico do banco de dados, versionamento dele 
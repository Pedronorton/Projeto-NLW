import path from 'path'

module.exports = {
    client: 'sqlite3', // qual bd irei usar
    connection: {
        filename: path.resolve(__dirname,'src','database','database.sqlite' )   //dirname retorna o caminho para o diretorio que quero
    },
    migrations: {
        directory: path.resolve(__dirname,'src','database','migrations' ) 
    },
    seeds: {
        directory: path.resolve(__dirname,'src','database','seeds' ) 
    },
    useNullAsDefault : true,

}
import multer from 'multer' // utilizado para facilitar o upload de imagens
import path from 'path'
import crypto from 'crypto'
export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname,'..','uploads'), // pra onde vai o arquivo quando for uploadado
        filename(request, file, callback){
            const hash = crypto.randomBytes(6).toString('hex') // gera uma chave aleatória
            const fileName = `${hash}-${file.originalname}`

            callback(null, fileName) // callback recebe um erro e o nome de arquivo, porem na hash e fileName é dificil de dar erro

        }
       
        
    })
}
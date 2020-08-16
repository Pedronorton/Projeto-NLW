import express, { request } from 'express'
import routes from './routes'
import path from 'path'

const app = express();
app.use(routes)
app.use(express.json())
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(3333)
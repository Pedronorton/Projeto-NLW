import knex from '../database/connection'
import {Request, Response} from 'express'



class PointsController {
    async index (request: Request,response: Response){
        
        const {city, uf, items} = request.query;
        
        const parsedItems = String(items).
        split(',').
        map(item => Number(item.trim()))
        
        const points = await knex('points')
        .join('points_items', 'points.id', '=', 'points_items.point_id')
        .whereIn('points_items.item_id', parsedItems)
        .orWhere('city',String(city))
        .orWhere('uf', String(uf))
        .distinct()
        .select('points.*')

        const serializedPoint = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.101:3333/uploads/${point.image}`
            }
        })

        return response.json(serializedPoint)
    }

    async create(request: Request,response: Response) { // preciso informar os tipode de dados 

            const {
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf,
                items
            } = request.body
            const trx = await knex.transaction();

            const point = {
                image: request.file.filename,
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf,
            }
            
            
            const insertedIds = await trx('points').insert(point)
            const point_id = insertedIds[0]
            const pointItens = items
                .split(',')
                .map((item: string) => Number(item.trim()))
                .map((item_id: number) => {
                    return {
                        item_id,
                        point_id
                    }
                })
            await trx('points_items').insert(pointItens)
            
            await trx.commit();

            return response.json({
                id: point_id,
                ...point, // pega todas as informações dentro de um obj e retorna em outro obj
            })
    }
    async show(request: Request,response: Response){
        
        const { id } = request.params // variavel é igual ao nome que ta na request, então isso funciona

        const point = await knex('points').where('id', id).first();
        if(!point){
            return response.status(400).json({message:"point not found"})
        }
        const items = await knex('items')
        .join('points_items', 'items.id', '=', 'points_items.item_id')
        .where('points_items.point_id', id);

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.0.101:3333/uploads/${point.image}`
        }
        return response.json({point: serializedPoint, items})        
    }
    
    async showPoints(request: Request,response: Response){
        const points = await knex('points').select("*");

        return response.json(points)        
    }
}

export default PointsController;
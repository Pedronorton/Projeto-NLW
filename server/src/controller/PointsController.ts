import knex from '../database/connection'
import {Request, Response} from 'express'


class PointsController {
    async index (request: Request,response: Response){
        const {city, uf, items} = request.body;
        const parsedItems = String(items).
        split(',').
        map(item => Number(item.trim()))
        
        const points = await knex('points')
        .join('points_items', 'points.id', '=', 'points_items.point_id')
        .whereIn('points_items.item_id', parsedItems)
        .where('city',String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')
        return response.json(points)
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
                image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
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
            const pointItens = items.map((item_id: number) => {
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

        return response.json({point, items})        
    }
    
    async showPoints(request: Request,response: Response){
        const points = await knex('points').select("*");

        return response.json(points)        
    }
}

export default PointsController;
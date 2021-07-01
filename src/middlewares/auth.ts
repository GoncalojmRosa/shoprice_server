import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import {c} from '../config/auth'

export default function autenticationMiddleware(request: Request, response: Response, next: NextFunction){
    const authHeader = request.headers.authorization;

    if(!authHeader){
        return response.status(401).send({error: "No token Provider"})
    }

    const parts = authHeader.split(' ')

    if(parts.length !== 2){
        return response.status(401).send({error: "Token Error"})
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)){
        return response.status(401).json({ error: 'Token malformatted.' })
    }

    jwt.verify(token, c(), (err: any, decoded: any)=>{
        if(err) return response.status(401).json({ error: 'Token Invalid.' })

        //@ts-ignore
        // request.userId = decoded.id;
        return next();
    })
}
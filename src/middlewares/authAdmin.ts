import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
const _helpers = require('../helpers/roles')
const authConfig = require('../config/auth')
const adminMiddleware = (request: Request, response: Response, next: NextFunction) => {
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

    jwt.verify(token, authConfig.secret, (err: any, decoded: any)=>{
        if(err) return response.status(401).json({ error: 'Token Invalid.' })

        //@ts-ignore
        // request.userId = decoded.id;

        if(decoded.role != _helpers.ADMIN){
            return response.status(403).json({ error: 'Unauthorized' })
        }
        
        return next();
    })
}

export default adminMiddleware;
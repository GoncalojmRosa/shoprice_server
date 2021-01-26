import db from "../database/connections";
import {PasswordHash} from "../security/passwordHash";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import _ from 'lodash'
const authConfig = require('../config/auth')
import nodemailer from "nodemailer";

function generateEmailToken(params = {}){
 return jwt.sign(params, authConfig.EMAIL_SECRET, {
     expiresIn: '1d'
 })
}

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: '1d'
    })
   }

export default class UserController{
    // USED IN ADMINISTRATION PANEL
    async index(request: Request, response: Response) {
        
    
        const users = await db('users').select('*');

        //@ts-ignore
        return response.json({users, ok: true, userId: request.userId});
      }
    // USED IN REGISTRATION PAGE
    async create(request: Request, response: Response) {
    
        const { id, name, email, password } = request.body;

        const trx = await db.transaction();
        
        try {
            const usersByEmail = await trx('users').where({email}).first();

            if(!usersByEmail){
                const hashedPassword = await PasswordHash.hashPassword(password);

                
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    name: "Email Verification",
                    host: "smtp.sapo.pt",
                    port: 25,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: "testeemail1@sapo.pt", // generated ethereal user
                        pass: "testeEmail!12345", // generated ethereal password
                    },
                });

                const tokenEmail = generateEmailToken({email: email});
                
                const user = await trx('users').insert({
                    name,
                    email,
                    password: hashedPassword,
                    emailToken: tokenEmail
                });
                
                const url = `http://localhost:3333/confirmation/${tokenEmail}`;
                
                transporter.sendMail({
                    to: email,
                    subject: 'Confirm Email',
                    html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                });
                    
                await trx.commit(user);


                return response.status(201).send({token: generateToken({email: email})});
            }else{
                // console.log("Erro")
                await trx.rollback();
                return response.status(400).json({
                    error: 'User already Exists',
                    });
            }
    
        } catch (err) {

            console.log(err);
            await trx.rollback();
            return response.status(400).json({
              error: 'Unexpected error while creating new User',
            });

        }
    }

    // USED IN NOTIFY PAGE
    async confirmation(request: Request, response: Response) {
        const trx = await db.transaction();
        try {
            jwt.verify(request.params.token, authConfig.EMAIL_SECRET);


            const user = await trx('users').where({emailToken: request.params.token}).first();

            if(!user){
                return response.status(400).json({
                    error: 'Please ask to resend a new Email Verification',
                  });
            }{
                // user.isConfirmed = true;
                const confirmUser = await trx('users').update({isConfirmed: true, emailToken: null}).where({id: user.id});

                await trx.commit(confirmUser);
            }

            const msg = `Parabéns!! Agora você faz parte da plataforma da Shoprice.`;
            // window.location.href = `/notify?title=Valide sua conta&=${msg}&url=/&text=Página Inicial`;

            response.redirect(`http://localhost:3000/notify?title=A sua conta foi validada com sucesso!&msg=${msg}&url=/&text=Página Inicial`);
    
            return response.status(201).send(user);
        } catch (error) {
            await trx.rollback();
            response.send(error)
        }
      }

    // USED IN LOGIN PAGE
    async authenticate(request: Request, response: Response) {
        
    
       const { email, password } = request.body;
       const trx = await db.transaction();

       try {
            const user = await trx('users').where({email}).first();
            if(!user){
                return response.status(400).json({
                    error: 'User Not Found',
                });
            }
            if(!await PasswordHash.isPasswordValid(password, user.password)){
                return response.status(400).json({
                    error: 'Invalid Password!',
                });
            }
            if(!user.isConfirmed){
                return response.status(400).json({
                    error: 'Your Email is not Confirmed!',
                });
            }

            user.password = undefined;

            const token = jwt.sign({id: user.id}, authConfig.secret,
                {
                    expiresIn: 86400,
                });

            await trx.commit();
        
            return response.json({user, token});
           
       } catch (error) {
           console.log(error)
       }

    }



    async update(request: Request, response: Response) {
        
        const trx = await db.transaction();
        
        try {
            const id = request.query;
            const  { name, email, password, avatar } = request.body;

            console.log(request.body)

            await trx('users').update({name, email, password, avatar}).where(id);
            
            await trx.commit();
    
            return response.status(201).send();

        } catch (err) {

            console.log(err);
            await trx.rollback();
            
            return response.status(400).json({
            error: 'Unexpected error while updating new User',
            });

        }
    }
}
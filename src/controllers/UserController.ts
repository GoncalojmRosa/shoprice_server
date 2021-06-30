import db from "../database/connections";
import {PasswordHash} from "../security/passwordHash";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const _helpers = require('../helpers/roles')
const authConfig = require('../config/auth')
import nodemailer from "nodemailer";
import { indexUser, UserInterface } from "../models/UserModel";
import { Body } from "node-fetch";

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

function decodeToken(params: string): { email: string; password: string } {
return jwt.decode(params) as { email: string; password: string }
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
                    secure: false, // true for 465,cls false for other ports
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
                
                await transporter.sendMail({
                    from: "testeemail1@sapo.pt",
                    to: email,
                    subject: 'Confirm Email',
                    html: `<!DOCTYPE html>
                    <html>
                    <head>
                    
                      <meta charset="utf-8">
                      <meta http-equiv="x-ua-compatible" content="ie=edge">
                      <title>Email Confirmation</title>
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <style type="text/css">
                      /**
                       * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
                       */
                      @media screen {
                        @font-face {
                          font-family: 'Source Sans Pro';
                          font-style: normal;
                          font-weight: 400;
                          src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                        }
                    
                        @font-face {
                          font-family: 'Source Sans Pro';
                          font-style: normal;
                          font-weight: 700;
                          src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                        }
                      }
                    
                      /**
                       * Avoid browser level font resizing.
                       * 1. Windows Mobile
                       * 2. iOS / OSX
                       */
                      body,
                      table,
                      td,
                      a {
                        -ms-text-size-adjust: 100%; /* 1 */
                        -webkit-text-size-adjust: 100%; /* 2 */
                      }
                    
                      /**
                       * Remove extra space added to tables and cells in Outlook.
                       */
                      table,
                      td {
                        mso-table-rspace: 0pt;
                        mso-table-lspace: 0pt;
                      }
                    
                      /**
                       * Better fluid images in Internet Explorer.
                       */
                      img {
                        -ms-interpolation-mode: bicubic;
                      }
                    
                      /**
                       * Remove blue links for iOS devices.
                       */
                      a[x-apple-data-detectors] {
                        font-family: inherit !important;
                        font-size: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                        color: inherit !important;
                        text-decoration: none !important;
                      }
                    
                      /**
                       * Fix centering issues in Android 4.4.
                       */
                      div[style*="margin: 16px 0;"] {
                        margin: 0 !important;
                      }
                    
                      body {
                        width: 100% !important;
                        height: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                      }
                    
                      /**
                       * Collapse table borders to avoid space between cells.
                       */
                      table {
                        border-collapse: collapse !important;
                      }
                    
                      a {
                        color: #1a82e2;
                      }
                    
                      img {
                        height: auto;
                        line-height: 100%;
                        text-decoration: none;
                        border: 0;
                        outline: none;
                      }
                      </style>
                    
                    </head>
                    <body style="background-color: #e9ecef;">
                    
                      <!-- start preheader -->
                      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
                        A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
                      </div>
                      <!-- end preheader -->
                    
                      <!-- start body -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    
                        <!-- start logo -->
                        <tr>
                          <td align="center" bgcolor="#e9ecef">
                            <!--[if (gte mso 9)|(IE)]>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                            <tr>
                            <td align="center" valign="top" width="600">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                              <tr>
                                <td align="center" valign="top" style="padding: 36px 24px;">
                                  <a href="https://sendgrid.com" target="_blank" style="display: inline-block;">
                                    <img src="./img/paste-logo-light@2x.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                                  </a>
                                </td>
                              </tr>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                          </td>
                        </tr>
                        <!-- end logo -->
                    
                        <!-- start hero -->
                        <tr>
                          <td align="center" bgcolor="#e9ecef">
                            <!--[if (gte mso 9)|(IE)]>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                            <tr>
                            <td align="center" valign="top" width="600">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                              <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                                </td>
                              </tr>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                          </td>
                        </tr>
                        <!-- end hero -->
                    
                        <!-- start copy block -->
                        <tr>
                          <td align="center" bgcolor="#e9ecef">
                            <!--[if (gte mso 9)|(IE)]>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                            <tr>
                            <td align="center" valign="top" width="600">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    
                              <!-- start copy -->
                              <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                  <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href="https://sendgrid.com">Shoprice</a>, you can safely delete this email.</p>
                                </td>
                              </tr>
                              <!-- end copy -->
                    
                              <!-- start button -->
                              <tr>
                                <td align="left" bgcolor="#ffffff">
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                      <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                              <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Confirm Account</a>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <!-- end button -->
                    
                              <!-- start copy -->
                              <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                  <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                  <p style="margin: 0;"><a href="${url}" target="_blank">https://shoprice.com</a></p>
                                </td>
                              </tr>
                              <!-- end copy -->
                    
                              <!-- start copy -->
                              <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                                  <p style="margin: 0;">Cheers,<br> Shoprice</p>
                                </td>
                              </tr>
                              <!-- end copy -->
                    
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                          </td>
                        </tr>
                        <!-- end copy block -->
                    
                        <!-- start footer -->
                        <tr>
                          <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                            <!--[if (gte mso 9)|(IE)]>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                            <tr>
                            <td align="center" valign="top" width="600">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    
                              <!-- start permission -->
                              <tr>
                                <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                                  <p style="margin: 0;">You received this email because we received a request for [type_of_action] for your account. If you didn't request [type_of_action] you can safely delete this email.</p>
                                </td>
                              </tr>
                              <!-- end permission -->
                    
                              <!-- start unsubscribe -->
                              <tr>
                                <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                                  <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank">unsubscribe</a> at any time.</p>
                                  <p style="margin: 0;">Paste 1234 S. Broadway St. City, State 12345</p>
                                </td>
                              </tr>
                              <!-- end unsubscribe -->
                    
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                          </td>
                        </tr>
                        <!-- end footer -->
                    
                      </table>
                      <!-- end body -->
                    
                    </body>
                    </html>`,
                });
                await trx.commit(user);

                return response.json({token: generateToken({email: email, role: _helpers.BASIC}), refresh_token: generateToken({ email, password: hashedPassword })});
            }else{
                // console.log("Erro")
                await trx.rollback();
                return response.status(400).json({
                    error: 'Já exsite um Utilizador com esse Email!',
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
        
    
       let { email, password ,refresh_token } = request.body;
       const trx = await db.transaction();

       

       try {
           let hashPassword

           if(refresh_token){
               const tokenUser = decodeToken(refresh_token)
               
               email = tokenUser.email
               hashPassword = tokenUser.password

               const user = await trx('users').where({email}).first();
               

               if(user.badge == 'Banned'){
                await trx.commit();
                return response.status(400).json({
                  error: 'Pedimos desculpa mas a sua conta foi Banida do nosso Site!',
                });
               }

               if(hashPassword !== user.password){
                await trx.rollback();
                    return response.status(400).json({
                        error: 'Invalid Password!',
                    });
                }

                const token = jwt.sign({id: user.id, email: user.email, role: user.role}, authConfig.secret,
                  {
                      expiresIn: 86400,
                  });
                    
                await trx.commit();
     
                return response.json({user,token: token, refresh_token: generateToken({ email, password: user.password })});
           }else{
                const user = await trx('users').where({email}).first();
                
                if(!user){
                    await trx.rollback();
                    return response.status(400).json({
                        error: 'Utilizador não Encontrado!',
                    });
                }
                if(user.role != 'admin'){
                  if(user.badge == 'Banned'){
                  
                    await trx.rollback();
                    return response.status(400).json({
                      error: 'Pedimos desculpa mas a sua conta foi Banida do nosso Site!',
                    });
                  }
                }

                if(!await PasswordHash.isPasswordValid(password, user.password)){
                    await trx.rollback();
                    return response.status(400).json({
                        error: 'Insira a Password correta!',
                    });
                }
                
                if(!user.isConfirmed){
                    await trx.rollback();
                    return response.status(401).json({
                        error: 'Your Email is not Confirmed!',
                    });
                }
                const token = jwt.sign({id: user.id, email: user.email, role: user.role}, authConfig.secret,
                    {
                        expiresIn: 86400,
                    });
                    
                await trx.commit();
    
                return response.json({user, token, refresh_token: generateToken({ email, password: user.password })});
           }
            
           
       } catch (error) {
            await trx.rollback();
           console.log(error)
       }

    }

    async indexUser(request: Request, response: Response) {
        
        const user_id = request.body.id;
        // console.log(request.body)
        try{
            const { id, avatar, name, email, badge, role, warnings } = (
              await indexUser(user_id)
            )[0] as UserInterface

            if(!name){
                return response.status(404).json({
                    error: 'User Not Found',
                });
            }
            return response.json({user:{
              id,
              name,
              avatar,
              email,
              badge,
              role,
              warnings
            }});

        }catch(err){
            console.log(err)
        }
      }

    async updateAvatar(request: Request, response: Response) {
      const trx = await db.transaction();
      try {
          const {id} = request.body;
          console.log(request.body)
          console.log(request.file.path)
            
            
            await trx('users').update({avatar: request.file.path}).where('id',id);
            
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

    async update(request: Request, response: Response) {
        
        const trx = await db.transaction();
        
        try {
            const {id} = request.body;
            const  { name, email, badge, role, warnings, code } = request.body;

            // const hashedPassword = await PasswordHash.hashPassword(password);
            
            await trx('users').update({name, email, badge: badge, role, warnings, code: code}).where('id',id);
            
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
    async deleteUser(request: Request, response: Response) {
        
      const trx = await db.transaction();
      
      try {
          const {id} = request.body;

          const userReports = await trx('reports').select('*').where('user_id',id);
          const userSuggestion = await trx('suggestions').select('*').where('user_id',id);
          const userComments = await trx('comments').select('*').where('user_id',id);
          const userNewsLetter = await trx('newsLetter').select('*').where('user_id',id);

          if(userReports){
            await trx('reports').delete('*').where('user_id',id);
          }
          if(userSuggestion){
            await trx('suggestions').delete('*').where('user_id',id);
          }
          if(userComments){
            await trx('comments').delete('*').where('user_id',id);
          }
          if(userNewsLetter){
            await trx('newsLetter').delete('*').where('user_id',id);
          }

          await trx('users').delete('*').where('id',id);
          
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

  async updatePassword(request: Request, response: Response) {
        
      const trx = await db.transaction();
      
      try {
        const  { id, password, confirmPassword } = request.body;

        // const hashedPassword = await PasswordHash.hashPassword(password);
        
        const userExist = await trx('users').select('*').where('id',id);

        if(!userExist){

          await trx.rollback();
        
          return response.status(400).json({
            error: 'Unexpected error while updating User',
          });
        }

        if(password === confirmPassword){
          const hashedPassword = await PasswordHash.hashPassword(password);

          await trx('users').update({password: hashedPassword}).where('id',id);

          await trx.commit();

          return response.status(201).send();

        }else{
          await trx.rollback();
          
          return response.status(400).json({
            error: 'Passwords não correspondem',
          });

        }          

      } catch (err) {

          console.log(err);
          await trx.rollback();
          
          return response.status(400).json({
          error: 'Unexpected error while updating new User',
          });

      }
    }

    async sendChangePasswordToken(request: Request, response: Response) {
        
      const trx = await db.transaction();
      
      try {
        const  { email } = request.body;

        console.log(request.body)

        // const hashedPassword = await PasswordHash.hashPassword(password);
        
        const userExist = await trx('users').select('*').where('email',email).first();

        if(!userExist){

          await trx.rollback();
        
          return response.status(400).json({
            error: 'Email indicado não se encontra registado!',
          });
        }

        const code = Math.floor(Math.random() * 999999) + 1

        const user = await trx('users').update({code: code}).where('email', email);

        let transporter = nodemailer.createTransport({
          name: "Email Verification",
          host: "smtp.sapo.pt",
          port: 25,
          secure: false, // true for 465,cls false for other ports
          auth: {
              user: "testeemail1@sapo.pt", // generated ethereal user
              pass: "testeEmail!12345", // generated ethereal password
          },
      });
        await transporter.sendMail({
          from: "testeemail1@sapo.pt",
          to: email,
          subject: 'Confirm Email',
          html: `<!DOCTYPE html>
          <html>
          <head>
          
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Email Confirmation</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
            /**
             * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
             */
            @media screen {
              @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 400;
                src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
              }
          
              @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 700;
                src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
              }
            }
          
            /**
             * Avoid browser level font resizing.
             * 1. Windows Mobile
             * 2. iOS / OSX
             */
            body,
            table,
            td,
            a {
              -ms-text-size-adjust: 100%; /* 1 */
              -webkit-text-size-adjust: 100%; /* 2 */
            }
          
            /**
             * Remove extra space added to tables and cells in Outlook.
             */
            table,
            td {
              mso-table-rspace: 0pt;
              mso-table-lspace: 0pt;
            }
          
            /**
             * Better fluid images in Internet Explorer.
             */
            img {
              -ms-interpolation-mode: bicubic;
            }
          
            /**
             * Remove blue links for iOS devices.
             */
            a[x-apple-data-detectors] {
              font-family: inherit !important;
              font-size: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              color: inherit !important;
              text-decoration: none !important;
            }
          
            /**
             * Fix centering issues in Android 4.4.
             */
            div[style*="margin: 16px 0;"] {
              margin: 0 !important;
            }
          
            body {
              width: 100% !important;
              height: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          
            /**
             * Collapse table borders to avoid space between cells.
             */
            table {
              border-collapse: collapse !important;
            }
          
            a {
              color: #1a82e2;
            }
          
            img {
              height: auto;
              line-height: 100%;
              text-decoration: none;
              border: 0;
              outline: none;
            }
            </style>
          
          </head>
          <body style="background-color: #e9ecef;">
          
            <!-- start preheader -->
            <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
              A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
            </div>
            <!-- end preheader -->
          
            <!-- start body -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
          
              <!-- start logo -->
              <tr>
                <td align="center" bgcolor="#e9ecef">
                  <!--[if (gte mso 9)|(IE)]>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                  <td align="center" valign="top" width="600">
                  <![endif]-->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td align="center" valign="top" style="padding: 36px 24px;">
                        <a href="https://sendgrid.com" target="_blank" style="display: inline-block;">
                          <img src="./img/paste-logo-light@2x.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                        </a>
                      </td>
                    </tr>
                  </table>
                  <!--[if (gte mso 9)|(IE)]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
                </td>
              </tr>
              <!-- end logo -->
          
              <!-- start hero -->
              <tr>
                <td align="center" bgcolor="#e9ecef">
                  <!--[if (gte mso 9)|(IE)]>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                  <td align="center" valign="top" width="600">
                  <![endif]-->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                      </td>
                    </tr>
                  </table>
                  <!--[if (gte mso 9)|(IE)]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
                </td>
              </tr>
              <!-- end hero -->
          
              <!-- start copy block -->
              <tr>
                <td align="center" bgcolor="#e9ecef">
                  <!--[if (gte mso 9)|(IE)]>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                  <td align="center" valign="top" width="600">
                  <![endif]-->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          
                    <!-- start copy -->
                    <tr>
                      <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                        <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href="https://sendgrid.com">Shoprice</a>, you can safely delete this email.</p>
                      </td>
                    </tr>
                    <!-- end copy -->
          
                    <!-- start button -->
                    <tr>
                      <td align="left" bgcolor="#ffffff">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                              <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                    <a href="https://shoprice.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">${code}</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <!-- end button -->
          
                    <!-- start copy -->
                    <tr>
                      <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                        <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                        <p style="margin: 0;"><a href="https://shoprice.com" target="_blank">https://shoprice.com</a></p>
                      </td>
                    </tr>
                    <!-- end copy -->
          
                    <!-- start copy -->
                    <tr>
                      <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                        <p style="margin: 0;">Cheers,<br> Shoprice</p>
                      </td>
                    </tr>
                    <!-- end copy -->
          
                  </table>
                  <!--[if (gte mso 9)|(IE)]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
                </td>
              </tr>
              <!-- end copy block -->
          
              <!-- start footer -->
              <tr>
                <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                  <!--[if (gte mso 9)|(IE)]>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                  <td align="center" valign="top" width="600">
                  <![endif]-->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          
                    <!-- start permission -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                        <p style="margin: 0;">You received this email because we received a request for [type_of_action] for your account. If you didn't request [type_of_action] you can safely delete this email.</p>
                      </td>
                    </tr>
                    <!-- end permission -->
          
                    <!-- start unsubscribe -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                        <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank">unsubscribe</a> at any time.</p>
                        <p style="margin: 0;">Paste 1234 S. Broadway St. City, State 12345</p>
                      </td>
                    </tr>
                    <!-- end unsubscribe -->
          
                  </table>
                  <!--[if (gte mso 9)|(IE)]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
                </td>
              </tr>
              <!-- end footer -->
          
            </table>
            <!-- end body -->
          
          </body>
          </html>`,
      });
      

      await trx.commit(user);
      return response.status(201).send({message: "Irá receber um Email dentro de segundos com um Código"});

      } catch (err) {

          console.log(err);
          await trx.rollback();
          
          return response.status(400).json({
          error: 'Unexpected error while updating new User',
          });

      }
    }

    async searchByLetters(request: Request, response: Response) {
        
      const trx = await db.transaction();
      
      try {
        const  { letters } = request.body;

        const userResponse = await trx('users').select('*').whereRaw(`name LIKE ?`, [`%${letters}%`])
        if(userResponse != []){
  
          await trx.commit();
  
          return response.status(201).send(userResponse);

        }else{
          return response.status(400).json({
            error: 'Utilizador não encontrado',
            });
        }

      } catch (err) {

          console.log(err);
          await trx.rollback();
          
          return response.status(400).json({
          error: 'Unexpected error while updating new User',
          });

      }
    }

    async changePassword(request: Request, response: Response) {
        
      const trx = await db.transaction();
      
      try {
        const  { code, password, confirmPassword } = request.body;

        // const hashedPassword = await PasswordHash.hashPassword(password);

        const codeExists = await trx('users').select('*').where('code', code).first();

        if(!codeExists){
          await trx.rollback();
      
          return response.status(400).json({
            error: 'Verifique se o código está correto!',
          });
        }

        if(password === confirmPassword){
          const hashedPassword = await PasswordHash.hashPassword(password);

          await trx('users').update({password: hashedPassword, code: null}).where('code',code);

          await trx.commit();

          return response.status(201).send({message: "Password alterada com Sucesso!"});

        }else{
          await trx.rollback();
          
          return response.status(400).json({
            error: 'Passwords não correspondem',
          });

        }          

      } catch (err) {

          console.log(err);
          await trx.rollback();
          
          return response.status(400).json({
          error: 'Unexpected error while updating new User',
          });

      }
    }
}
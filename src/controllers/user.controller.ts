import { prisma } from "../libs/clients.lib";
import { Request, Response } from "express";
import { encryptPassword, matchPassword } from "../libs/auth.lib";
import * as jsonwebtoken from 'jsonwebtoken';

const { SECRET }: any = process.env;

class UserController {

    async signup(req: Request, res: Response) {
        try {
            let { name, password } = req.body;
            if (!name || !password) return res.sendStatus(400);
            const jwt = jsonwebtoken.sign({ name, password }, SECRET, {expiresIn: '15m'});
            password = await encryptPassword(password);

            await prisma.user.create({
                data: {
                    name,
                    password,
                    jwt
                }
            });
            res.cookie('jwt', jwt, {maxAge: 900000, httpOnly: true});

            return res.json({ name, jwt });
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    }


    async signin(req: Request, res: Response){
        const {name, password} = req.body;
        if(name === undefined || password === undefined) return res.sendStatus(400);
        try{
            const user = await prisma.user.findFirst({
                where: {
                    name
                }
            });

            if(user?.id === undefined) return res.status(401).json({'Erorr': 'Invalid Credentials'});

            if((await matchPassword(password, user.password))) {
                const jwt = jsonwebtoken.sign({ name, password }, SECRET, {expiresIn: '15m'});
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        jwt
                    }
                });
                res.cookie('jwt', jwt, {maxAge: 900000, httpOnly: true});
                return res.json({name, jwt});
            }

            return res.status(401).json({'Erorr': 'Invalid Credentials'});
        }catch(e){
            console.log(e);
            return res.sendStatus(500);
        }
    }
    
}

export default new UserController;
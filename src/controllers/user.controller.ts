import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { encryptPassword } from "../libs/auth.lib";
import * as jsonwebtoken from 'jsonwebtoken';

const { SECRET }: any = process.env;

const prisma = new PrismaClient();

class UserController {

    async signup(req: Request, res: Response) {
        try {
            let { name, password } = req.body;
            if (!name || !password) return res.sendStatus(400);
            const jwt = jsonwebtoken.sign({ name, password }, SECRET);
            password = await encryptPassword(password);

            await prisma.user.create({
                data: {
                    name,
                    password,
                    jwt
                }
            });

            return res.json({ name, jwt });
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    }
}

export default new UserController;
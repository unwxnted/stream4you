import { Request, Response, NextFunction } from "express";
import * as jsonwebtoken from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import { RequestOptions } from "https";

const {SECRET} : any = process.env;

interface CustomRequest extends Request {
    jwt?: string;
}

export const encryptPassword = async (password : string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export const matchPassword = async (password: string, savedPasword : string) =>{

    try{
        return await bcrypt.compare(password, savedPasword);
    }catch(e){
        console.log(e)
    }
    
};

export const isLogged = async (req: CustomRequest, res: Response, next : NextFunction) => {
    const token = req.headers['authorization'];
    if(token === undefined) return res.status(400).json({'Error': 'Token Missing'});
    req.jwt = token;
    jsonwebtoken.verify(req.jwt, SECRET, (err : any, data : any) => {
        if(!err) return next();
        console.log(err);
        return res.status(403).json({'Error': 'Token not valid'});
    });
}
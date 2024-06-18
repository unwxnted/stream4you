import { Response, Request } from "express";
import multer from "multer";
import * as fs from "fs";

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

export const removeFile = (filename : any) => {

    const filePath = './uploads/' + filename; 
    try {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('Error file 404');
            }
    
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error on unlink file: ', err);
                }
            });
        });
    } catch (e) {
        console.log(e);
    } 
}

export const upload = multer({ storage: storage });
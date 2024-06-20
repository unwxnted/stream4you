import { Router } from "express";
import { upload } from "../libs/file.lib";
import audioController from "../controllers/audio.controller";
import { isLogged } from "../libs/auth.lib";

const AudioRouter : Router = Router();

AudioRouter.get('/audio/stream/:id', isLogged,audioController.stream);
AudioRouter.get('/audio/:id', isLogged, audioController.getById);
AudioRouter.get('/audio/', isLogged, audioController.getAll);
AudioRouter.post('/audio/upload',isLogged, upload.single('upfile'), audioController.post);

export default AudioRouter;
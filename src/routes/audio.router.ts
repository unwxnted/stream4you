import { Router } from "express";
import { upload } from "../libs/file.lib";
import audioController from "../controllers/audio.controller";
import { isLogged } from "../libs/auth.lib";

const AudioRouter : Router = Router();

AudioRouter.get('/audio/stream/:id', audioController.stream);
AudioRouter.post('/audio/upload',isLogged, upload.single('upfile'), audioController.post);

export default AudioRouter;
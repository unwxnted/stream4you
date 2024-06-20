import { prisma, esClient } from '../libs/clients.lib'
import { Request, Response } from "express";
import { removeFile } from "../libs/file.lib";
import ffmpeg from "fluent-ffmpeg";
import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg"

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

import * as fs from 'fs';


class AudioController {

    async getAll(req: Request, res: Response) {
        try {
            const audios = await prisma.audio.findMany();
            return res.json(audios);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ 'Error': 'Error on returning data' });
        }
    }

    async query(req: Request, res: Response) {
        const { title } = req.query;
        try {
            let query = {
                index: 'audio',
                q: ''
            };
            if (title !== undefined) query.q = title.toString();
            let body;
            esClient.search(query)
                .then(resp => {
                    body=resp.hits.hits;
                    body = body.map(hit=>hit._source);
                    res.json(body);
                })
                .catch(err => {
                    console.log(err);
                    return res.sendStatus(500);
                });
            
        }catch(e){
            console.log(e);
            return res.status(500).json({'Error': 'Error on Searching process'});
        }
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;
        if (id === undefined) return res.status(400).json({ 'Error': 'id missing' });
        try {
            const audio = await prisma.audio.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            if (!audio) return res.status(404).json({ 'Error': 'Song not found' });
            return res.json(audio);
        } catch {
            return res.status(500).json({ 'Error': 'Internal Server Error' });
        }
    }

    async stream(req: Request, res: Response) {
        const { id } = req.params;
        let rate: number = parseInt(req.query.rate as string) as number;
        if (isNaN(rate)) rate = 128;
        let range: string | undefined = req.headers.range;

        const audio_id: number = parseInt(id);
        const audio = await prisma.audio.findUnique({ where: { id: audio_id } });
        if (!audio) return res.sendStatus(404);
        const filePath = `uploads/${audio.path}`;
        const fileSize = fs.statSync(filePath).size;

        let fileStream;

        if (range !== undefined) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "audio/mpeg"
            });
            fileStream = fs.createReadStream(filePath, { start, end });
            fileStream.pipe(res);

        } else {
            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': fileSize
            });
            fileStream = fs.createReadStream(filePath);
            try {
                ffmpeg(fileStream)
                    .audioBitrate(rate)
                    .format('mp3')
                    .on('error', (e) => {
                        console.log(e);
                    })
                    .pipe(res, { end: true });
            } catch (e) {
                console.log(e);
            }
        }

    }

    async post(req: Request, res: Response) {
        const { title } = req.body;
        const file = req.file;
        const filename: any = file?.filename;
        const { jwt }: any = req;

        if (title === undefined) {
            removeFile(filename)
            return res.sendStatus(400);
        }

        const user_id: any = await prisma.user.findFirst({
            where: {
                jwt
            },
            select: {
                id: true
            }
        });

        const audio = await prisma.audio.create({
            data: {
                title,
                path: filename,
                user_id: user_id['id']
            }
        })

        await esClient.index({
            index: 'audio',
            id: audio.id.toString(),
            body: {
                title: audio.title,
                path: audio.path,
                user_id: audio.user_id
            }
        });

        return res.sendStatus(200);

    }

}

export default new AudioController;
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { removeFile } from "../libs/file.lib";
import ffmpeg from "fluent-ffmpeg";
import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg"

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

import * as fs from 'fs';

const prisma = new PrismaClient();

class AudioController {

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

        await prisma.audio.create({
            data: {
                title,
                path: filename,
                user_id: user_id['id']
            }
        })

        return res.sendStatus(200);

    }

}

export default new AudioController;
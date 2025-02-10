import { prisma, esClient, redis } from '../libs/clients.lib'
import { Request, Response } from "express";
import { removeFile } from "../libs/file.lib";
import ffmpeg from "fluent-ffmpeg";
import { promisify } from 'util';
import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import * as ffprobeInstaller from "@ffprobe-installer/ffprobe";
import fs from 'fs';
import * as path from 'node:path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const stat = promisify(fs.stat);

class AudioController {

    async getAll(req: Request, res: Response) {
        try {
            const redisData = await redis.get('all-audios');
            if(redisData) return res.json(JSON.parse(redisData));
            
            const audios = await prisma.audio.findMany();
            await redis.set('all-audios', JSON.stringify(audios));

            return res.json(audios);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ 'Error': 'Error on returning data' });
        }
    }

    async query(req: Request, res: Response) {
        const { search } = req.query;
        try {
            let query = {
                index: 'audio',
                q: ''
            };
            if (search !== undefined) query.q = search.toString();
            const redisData = await redis.get(`query-${search}`) as string;
            if(redisData) return res.json(JSON.parse(redisData));
            let body;
            esClient.search(query)
                .then(resp => {
                    body = resp.hits.hits;
                    body = body.map(hit => hit._source);
                    redis.set(`query-${search}`, JSON.stringify(body));
                    res.json(body);
                })
                .catch(err => {
                    console.log(err);
                    return res.sendStatus(500);
                });

        } catch (e) {
            console.log(e);
            return res.status(500).json({ 'Error': 'Error on Searching process' });
        }
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;
        if (id === undefined) return res.status(400).json({ 'Error': 'id missing' });
        try {
            const redisData = await redis.get(`id-${id}`);
            if(redisData) return res.json(JSON.parse(redisData));
            const audio = await prisma.audio.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            if (!audio) return res.status(404).json({ 'Error': 'Song not found' });
            await redis.set(`id-${id}`, JSON.stringify(audio));
            return res.json(audio);
        } catch {
            return res.status(500).json({ 'Error': 'Internal Server Error' });
        }
    }

    async stream(req: Request, res: Response) {
        const { id } = req.params;
        let rate: number = parseInt(req.query.rate as string) as number;
        let range: string | undefined = req.headers.range;

        const audio_id: number = parseInt(id);
        const cacheKey = `audio_${audio_id}_${rate}_${range || 'full'}`;

        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            const buffer = Buffer.from(cachedData, 'base64');
            res.setHeader('Content-Length', buffer.length);
            res.setHeader('Content-Type', 'audio/mpeg');
            res.status(range ? 206 : 200).end(buffer);
            return;
        }

        const audio = await prisma.audio.findUnique({ where: { id: audio_id } });
        if (!audio) return res.sendStatus(404);
        const filePath = path.join(__dirname, '..', '..','/uploads/', audio.path);
        const fileSize = (await stat(filePath)).size;

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
            fileStream.on('data', async (chunk) => {
                await redis.append(cacheKey, chunk);
            });
            fileStream.pipe(res);
        } else {
            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': fileSize
            });
            fileStream = fs.createReadStream(filePath);
            let data : any = [];
            try {
                if (isNaN(rate)) {
                    fileStream.on('data', chunk => data.push(chunk));
                    fileStream.on('end', async () => {
                        const buffer = Buffer.concat(data);
                        await redis.set(cacheKey, buffer.toString('base64'));
                        res.end(buffer);
                    });
                    fileStream.pipe(res);
                    return;
                }

                ffmpeg(fileStream)
                    .audioBitrate(rate)
                    .format('mp3')
                    .on('data', chunk => data.push(chunk))
                    .on('end', async () => {
                        const buffer = Buffer.concat(data);
                        await redis.set(cacheKey, buffer.toString('base64'));
                        res.end(buffer);
                    })
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
        const { title, artist, genre } = req.body;
        const file = req.file;
        const filename: any = file?.filename;
        const { jwt }: any = req;

        if (title === undefined || artist === undefined || genre === undefined) {
            removeFile(filename)
            return res.sendStatus(400);
        }

        const user: any = await prisma.user.findFirst({
            where: {
                jwt: (jwt!==undefined ? jwt : req.cookies.jwt)
            }
        });

        if (user === undefined) return res.status(404).json({ 'Error': 'User Not found' });

        await redis.del('all-audios');

        const keys = await redis.keys('query-*');
        for (const key of keys) {
            await redis.del(key);
        }
        
        const audio = await prisma.audio.create({
            data: {
                title,
                artist,
                genre,
                path: filename,
                user_id: user.id
            }
        })

        await esClient.index({
            index: 'audio',
            id: audio.id.toString(),
            body: {
                song_id: audio.id,
                title: audio.title,
                artist: audio.artist,
                genre: audio.genre,
                user_id: audio.user_id
            }
        });

        return res.sendStatus(200);

    }

}

export default new AudioController;
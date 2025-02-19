import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { purifyRequest } from './libs/purify.lib';

import AudioRouter from './routes/audio.router';
import UserRouter from './routes/user.router';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(purifyRequest);

app.use('/api', UserRouter);
app.use('/api', AudioRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


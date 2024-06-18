import express from 'express';
import cors from 'cors';

import AudioRouter from './routes/audio.router';
import UserRouter from './routes/user.router';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', UserRouter);
app.use('/api', AudioRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: '20kb' }));

app.use(express.urlencoded({ extended: true, limit: '20kb' }));

app.use(express.static('public'));

//routes import

import userRouter from './routes/user.routes.js';
import questionnaireRouter from './routes/questionnaire.routes.js';
import questionRouter from './routes/question.routes.js';
import responseRouter from './routes/response.routes.js'

// routes declaration

app.use('/api/v1/users', userRouter);
app.use('/api/v1/queationnaire', questionnaireRouter);
app.use('/api/v1/question', questionRouter);
app.use('/api/v1/response', responseRouter);


//questionnaire routes

export { app };
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { createTimerCommand } from './commands/timer';

console.log(process.env.CLIENT_PUBLIC_KEY);

const bootstrap = async () => {
  const app = express();
  const port = 3000;

  app.use(cors());
  app.use((req, res, next) => {
    if (req.path === '/interactions') {
      next(); // Skip middleware for interactions
    } else {
      express.json()(req, res, next);
    }
  });
  app.set('view engine', 'ejs');
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World!' });
  });

  app.get('/terms-of-service', (req, res) => {
    res.render('terms', { title: 'Terms of Service' });
  });

  app.get('/privacy-policy', (req, res) => {
    res.render('privacy', { title: 'Privacy Policy' });
  });

  app.post(
    '/interactions',
    verifyKeyMiddleware(process.env.CLIENT_PUBLIC_KEY),
    (req, res) => {
      const { type, id, data } = req.body;
      console.log('Received interaction', req.body);

      /**
       * Handle verification requests
       */
      if (type === InteractionType.PING) {
        res.send({ type: InteractionResponseType.PONG });
      }

      res.send({ type: InteractionResponseType.PONG });
    },
  );

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    createTimerCommand(process.env.APP_ID);
  });
};

void bootstrap();

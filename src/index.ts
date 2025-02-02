import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { createTimerCommand } from './commands/timer';
import { TimerBossService } from './services/boss.service';
import { Client } from 'discord.js';

console.log(process.env.CLIENT_PUBLIC_KEY);

const discordClient = new Client({
  intents: [],
});
discordClient.login(process.env.DISCORD_TOKEN);

async function countdownTimer(channel: any, seconds: any) {
  let message = await channel.send(
    `⏳ Countdown: ${seconds} seconds remaining...`,
  );

  console.log(channel);

  for (let i = seconds; i > 0; i--) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    await message.edit(`⏳ Countdown: ${i} seconds remaining...`);
  }

  await message.edit("🚀 Time's up!");
}

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
    verifyKeyMiddleware(process.env.CLIENT_PUBLIC_KEY as string),
    async (req, res) => {
      const { type, id, data, channel_id } = req.body;

      // Get the 'boss' interaction
      if (data.name === 'boss') {
        // Fetch the channel if it's not cached
        let channel;
        try {
          channel = await discordClient.channels.fetch(channel_id);

          console.log('channel', channel);
        } catch (err) {
          console.error('Error fetching channel:', err);
          res.status(500).json({
            error: 'Failed to fetch the channel',
          });
          return;
        }

        // Start the countdown

        const bossService = TimerBossService.getInstance();
        const timerBoss = await bossService.createTimerBoss(data, channel_id);

        countdownTimer(channel, timerBoss.duration); // Start 10-second countdown

        res.status(200).json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: 'A wild boss has appeared! Starting countdown...' },
        });
      } else {
        // If the interaction doesn't match the expected name
        res.status(400).json({
          error: 'Unknown interaction type',
        });
      }
    },
  );

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    createTimerCommand(process.env.APP_ID as string);
  });
};

void bootstrap();

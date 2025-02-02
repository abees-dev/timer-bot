import { EmbedBuilder } from 'discord.js';

interface BossTimer {
  bossName: string;
  time: number;
  channel: string;
}

const bossRespawnTimes = {
  golem: 60 * 60, // 60 minutes in seconds
  ender_dragon: 60 * 60 * 6, // 6 hours in seconds
  gorgon: 60 * 60, // 60 minutes in seconds
};

export interface Command {
  id: string;
  name: string;
  options: Option[];
  type: number;
}

export interface Option {
  name: string;
  type: number;
  value: any;
}

export class TimerBossService {
  private bossTimers: BossTimer[];

  private static instance: TimerBossService;

  private constructor() {
    this.bossTimers = [];
  }

  static getInstance(): TimerBossService {
    if (!TimerBossService.instance) {
      TimerBossService.instance = new TimerBossService();
    }

    return TimerBossService.instance;
  }

  async createTimerBoss(
    command: Command,
    channel: string,
  ): Promise<BossTimer & { duration: number }> {
    const bossName = command.options.find(
      (option) => option.name === 'boss_name',
    )?.value as keyof typeof bossRespawnTimes;
    const duration = command.options.find(
      (option) => option.name === 'duration',
    )?.value;

    if (!bossName) {
      throw new Error('Boss name is required');
    }

    const time = Date.now() + (duration || bossRespawnTimes[bossName]);

    this.bossTimers.push({ bossName, time, channel });

    return {
      bossName,
      time,
      channel,
      duration: duration || bossRespawnTimes[bossName],
    };
  }

  async getBossTimers(): Promise<BossTimer[]> {
    return this.bossTimers;
  }

  async countDownBossTimers(channel: any, duration: number, bossName: any) {
    let remainingTime = duration;
    let message: any = null;
    const mappedBossName: Record<string, string> = {
      golem: 'Golem',
      ender_dragon: 'Ender Dragon',
      gorgon: 'Gorgon',
    };

    const updateMessage = async () => {
      const hours = Math.floor(remainingTime / 3600);
      const minutes = Math.floor((remainingTime % 3600) / 60);
      const seconds = remainingTime % 60;
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      const embed = new EmbedBuilder()
        .setTitle(`⏳ Boss ${mappedBossName[bossName]} Respawn Timer`)
        .setDescription(`Time remaining: **${formattedTime}**`)
        .setColor(0x00ff00);

      console.log('channel', '');
      if (message) {
        await message.edit({
          embeds: [embed],
        });
      } else {
        message = await channel.send({
          embeds: [embed],
        });
      }

      return message;
    };

    const intervalId = setInterval(async () => {
      if (remainingTime > 0) {
        message = await updateMessage();
        console.log('channel', '');
        remainingTime--;
      } else {
        clearInterval(intervalId);
        if (message) {
          message.delete();
        }
        const embed = new EmbedBuilder()
          .setTitle(`⏳ Boss ${mappedBossName[bossName]} Respawn Timer`)
          .setDescription(
            `Boss ${mappedBossName[bossName]} has respawned! 🎉 @everyone`,
          )
          .setColor(0xff0000);
        await channel.send({ embeds: [embed] });
      }
    }, 1000);
  }
}

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

  async countDownBossTimers(channel: any, duration: number) {
    let remainingTime = duration;
    let message: any = null;

    const updateMessage = async () => {
      const content = `⏳ Countdown: ${remainingTime} seconds remaining...`;
      console.log('channel', channel);
      if (message) {
        await message.edit(content);
      } else {
        message = await channel.send(content);
      }
    };

    const intervalId = setInterval(async () => {
      if (remainingTime > 0) {
        await updateMessage();
        console.log('channel', channel);
        remainingTime--;
      } else {
        clearInterval(intervalId);
        await channel.send("🚀 Time's up!");
      }
    }, 1000);
  }
}

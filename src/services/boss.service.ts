interface BossTimer {
  bossName: string;
  time: number;
  channel: string;
}

const bossRespawnTimes = {
  golem: 6 * 60 * 60 * 1000,
  ender_dragon: 6 * 60 * 60 * 1000,
  gorgon: 1 * 60 * 60 * 1000,
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

  async createTimerBoss(command: Command, channel: string): Promise<BossTimer> {
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
    };
  }

  async getBossTimers(): Promise<BossTimer[]> {
    return this.bossTimers;
  }
}

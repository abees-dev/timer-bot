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

export class TimerBossService {
  private bossTimers: BossTimer[];

  constructor() {
    this.bossTimers = [];
  }

  async createTimerBoss(
    bossName: string,
    time: number,
    channel: string,
  ): Promise<void> {
    const bossTimer: BossTimer = {
      bossName,
      time,
      channel,
    };
    this.bossTimers.push(bossTimer);
    setTimeout(() => {
      this.bossTimers = this.bossTimers.filter((timer) => timer !== bossTimer);
    }, time);
  }

  async getBossTimers(): Promise<BossTimer[]> {
    return this.bossTimers;
  }
}

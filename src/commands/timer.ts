import { InstallGlobalCommands } from '../utils/discord';

export const createTimerCommand = async (appId: string) => {
  // Define the command
  const command = {
    name: 'boss',
    description: 'Create a boss timer',
    options: [
      {
        name: 'boss_name',
        description: 'Choose a boss to set a timer for',
        type: 3,
        required: true,
        choices: [
          {
            name: 'Golem',
            value: 'golem',
          },
          {
            name: 'Ender Dragon',
            value: 'ender_dragon',
          },
          {
            name: 'Gorgon',
            value: 'gorgon',
          },
        ],
      },
      {
        name: 'duration',
        description: 'Set the duration for the timer (in minutes)',
        type: 4,
        required: false,
      },
    ],
  };

  // Install the command
  await InstallGlobalCommands(appId, [command]);
};

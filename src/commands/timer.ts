import { InstallGlobalCommands } from '../utils/discord';

export const createTimerCommand = async (appId: string) => {
  // Define the command
  const command = {
    name: 'boss',
    description: 'Create a boss timer',
    options: [
      {
        name: 'golem',
        description: 'Set a timer for the Golem boss',
        type: 3,
        required: true,
      },
      {
        name: 'ender_dragon',
        description: 'Set a timer for the Ender Dragon boss',
        type: 3,
        required: true,
      },
      {
        name: 'gorgon',
        description: 'Set a timer for the Gorgon boss',
        type: 3,
        required: true,
      },
    ],
  };

  // Install the command
  await InstallGlobalCommands(appId, [command]);
};

import { InstallGlobalCommands } from '../utils/discord';

export const createTimerCommand = async (appId: string) => {
  // Define the command
  const command = {
    name: 'timer',
    description: 'Create a timer',
    options: [
      {
        name: 'duration',
        description: 'The duration of the timer',
        type: 3,
        required: true,
      },
    ],
  };

  // Install the command
  await InstallGlobalCommands(appId, [command]);
};

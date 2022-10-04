export * from './Cache';
import { setTimeout } from 'timers/promises';

Promise.prototype.timeout = async function(ms: number, message: string = 'Promise Timeout') {
  const timeoutContent: string = 'TIMEOUT';
  const timeoutPromise = setTimeout(ms, timeoutContent);
  const winner = await Promise.race([this, timeoutPromise]);

  if (winner === timeoutContent) {
    throw new Error(message);
  }

  return winner;
}

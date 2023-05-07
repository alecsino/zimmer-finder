import { Telegraf } from 'telegraf';
import Scheduler from "./src/services/scheduler";
import MessageHandler from './src/services/message-handler';
import config from './config.json';

const ChatID = config.CHAT_ID;

const bot = new Telegraf(config.BOT_TOKEN);
const scheduler = new Scheduler(bot);
const msgHandler = new MessageHandler(bot);

(async () => {
    await bot.launch();
    scheduler.init();
    msgHandler.init();
})();

export {scheduler, msgHandler, ChatID}

process.once('SIGINT', async () => {await bot.stop('SIGINT'); process.exit();});
process.once('SIGTERM', async () => {await bot.stop('SIGTERM'); process.exit();});

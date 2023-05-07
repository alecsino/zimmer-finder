import { Markup } from 'telegraf';
import * as commands from '../commands'
import { Command } from '../types/command';

export default class MessageHandler {
    private bot: any;

    constructor(bot: any){
        this.bot = bot;
    }

    public init(){
        for(let cmds in commands){
            this.addCommand(commands[cmds as keyof typeof commands]);
        }
    }

    public addCommand(command: Command){
        this.bot.command(command.name, (ctx: any) => {
            ctx.reply(command.text, {
                parse_mode: 'MarkdownV2',
                ...(command.inlineKeyboardFn?.() ?? [])
            })
        })

        command.callbacks?.forEach(c => {
            this.bot.action(c.isReg ? new RegExp(c.name) : c.name, c.fn)
        })
    }


}
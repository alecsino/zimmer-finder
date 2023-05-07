import * as sites from "../sites";
import { Markup } from "telegraf";
import { scheduler } from "../../index";
import { Command } from "../types/command";

let disable: Command = {
    name: "disable",
    text: "*Select a module to disable*",
    inlineKeyboardFn: () => {
        let buttons = [];

        for(let key in sites) {
            if(!sites[key as keyof typeof sites].disabled) 
                buttons.push(Markup.button.callback(key, `disable-${key}`));
        }

        return Markup.inlineKeyboard(buttons);
    },
    callbacks: [{
        isReg: true,
        name: "^disable-(.+)$",
        fn: (ctx: any) => {
            if(!sites[ctx.match[1] as keyof typeof sites] || sites[ctx.match[1] as keyof typeof sites].disabled) return;
            scheduler.disableModule(ctx.match[1]);
            ctx.editMessageText(`Disabled ${ctx.match[1]} 👍`);
        }
    }]
}

export default disable;
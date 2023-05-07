import * as sites from "../sites";
import { Markup } from "telegraf";
import { scheduler } from "../../index";
import { Command } from "../types/command";

let disable: Command = {
    name: "enable",
    text: "*Select a module to enable*",
    inlineKeyboardFn: () => {
        let buttons = [];

        for(let key in sites) {
            if(sites[key as keyof typeof sites].disabled) 
                buttons.push(Markup.button.callback(key, `enable-${key}`));
        }

        return Markup.inlineKeyboard(buttons);
    },
    callbacks: [{
        isReg: true,
        name: "^enable-(.+)$",
        fn: (ctx: any) => {
            if(!sites[ctx.match[1] as keyof typeof sites] || !sites[ctx.match[1] as keyof typeof sites].disabled) return;
            scheduler.addSite(sites[ctx.match[1] as keyof typeof sites]);
            ctx.editMessageText(`Enabled ${ctx.match[1]} 👍`);
        }
    }]
}

export default disable;
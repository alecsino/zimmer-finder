import { Markup } from "telegraf"
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram"

export interface Command {
    name: string,
    text: string,
    inlineKeyboardFn?: Function,
    callbacks?: Array<CallbackCommand>
}

export interface CallbackCommand {
    isReg?: boolean,
    name: string,
    fn: Function
}
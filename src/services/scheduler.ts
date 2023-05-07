import * as sites from "../sites";
import buildMsg from './build-msg'
import { ChatID } from "../..";

export default class Scheduler {
    private list:any = {};
    private bot: any;

    constructor(bot: any){
        this.bot = bot;
    }

    public init(){
        for(let key in sites){
            this.addSite(sites[key as keyof typeof sites])
        }
    }

    public addSite(site: any){

        if(site.isTest){
            site.request();
            return;
        }

        site.disabled = false;
        this.list[site.name] = setInterval(async () => {
            let res = await site.request();

            if(res?.error) this.errorHandler(site.name);
            else if(res) this.bot.telegram.sendMessage(ChatID, buildMsg(res, site.name), { parse_mode: 'MarkdownV2' }).catch((e:any) => {
                this.bot.telegram.sendMessage(ChatID, "There has been an error with a message\n" + e.toString())
            });

        }, site.timer);

    }

    private errorHandler(site: string){
        this.bot.telegram.sendMessage(ChatID, `Disabling ${site} because an error occurred`);
        this.disableModule(site);
    }

    public disableModule(site: string){
        clearInterval(this.list[site]);
        sites[site as keyof typeof sites].disabled = true;
    }
}
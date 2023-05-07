import { req, Parser} from '../services/req';
import HTTPRequest from '../types/request';
import Zimmer from '../types/zimmer'

let compareZimmer: Zimmer;

export default class Woko{
    public static timer = 10000;
    public static disabled = false;

    public static async request(): Promise<Zimmer | undefined> {
        let page : HTTPRequest = await req('https://www.woko.ch/en/zimmer-in-zuerich').catch(e => { return {statusCode: -1} } );

        if(page.statusCode != 200) {
            console.log("There has been an error with the request.");
            return;
        }

        let document = new Parser(page.body ?? "");
        let elements = document.querySelector("#filterResultat .inserat");

        let lastElement = elements[0].querySelector(".col-xs-12.col-sm-8 .titel");
        let lastZimmer : Zimmer = {
            title: lastElement?.querySelector("h3")?.innerText,
            date: lastElement?.querySelector("span")?.innerText,
            link: "https://woko.ch" + elements[0].querySelector("a")?.attributes.href
        }

        let tempDate = lastZimmer.date?.split(" ")[0].split(".") ?? [];
        let tempTime = lastZimmer.date?.split(" ")[1].split(":") ?? [];
        lastZimmer.dateParsed = new Date(+tempDate[2], +tempDate[1]-1, +tempDate[0], +tempTime[0], +tempTime[1]);

        if(lastZimmer.dateParsed > (compareZimmer?.dateParsed ?? 0)) {
            compareZimmer = lastZimmer;
            return lastZimmer;
        }
    }

}

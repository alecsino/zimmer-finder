import { req, Parser} from '../services/req';
import HTTPRequest from '../types/request';
import Zimmer from '../types/zimmer'
import config from '../../config.json';
import * as fs from 'fs';

let compareZimmer: Zimmer;

export default class WGZimmer{
    public static timer = 10000;
    public static disabled = false;

    public static async request(): Promise<Zimmer | undefined>{
        let page : HTTPRequest = await req({
            url: 'https://www.wgzimmer.ch/en/wgzimmer/search/mate.html',
            method: "POST",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                'cookie': `JSESSIONID=`+config.WGZimmer+`; wc_language=de; wc_currencyLocale=de_CH; wc_color=babyblue; wc_email="info@wgzimmer.ch"; wc_currencySign=sFr.`
            },
            data: `query=&priceMin=200&priceMax=1500&state=zurich-stadt&permanent=all&student=none&typeofwg=all&orderBy=%40sortDate&orderDir=descending&startSearchMate=true&wgStartSearch=true&start=0`
        }).catch(e => { return {statusCode: -1} } );

        if(page.statusCode != 200) {
            console.log("There has been an error with the request.");
            return;
        }

        let document = new Parser(page.body ?? "");
        let lastElement = document.querySelector(".search-result-entry.search-mate-entry")[0];

        if(!lastElement){
            fs.writeFileSync("error.html", page.body ?? "");
            console.log("error wgzimmer");
            return {error: true};
        }

        let data = lastElement.querySelectorAll("a")[1];

        let zimmer : Zimmer = {
            id: lastElement.querySelectorAll("a")[0].attributes.id,
            title: `Shared room in ${data.querySelector(".thumbState")?.innerText.trim()}`,
            body: `From ${data.querySelector(".from-date")?.innerText.trim()}`,
            date: data.querySelector(".create-date.left-image-result strong")?.innerText.trim(),
            link: "https://www.wgzimmer.ch" + data.attributes.href
        }

        let tempDate = zimmer.date?.split(".") ?? [];
        zimmer.dateParsed = new Date(+tempDate[2], +tempDate[1]-1, +tempDate[0]);

        if(zimmer.dateParsed >= (compareZimmer?.dateParsed ?? 0) && zimmer.id != compareZimmer?.id) {
            compareZimmer = zimmer;
            return zimmer;
        }
    }

}

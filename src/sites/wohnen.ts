import { req, Parser} from '../services/req';
import HTTPRequest from '../types/request';
import Zimmer from '../types/zimmer'
import config from '../../config.json';
import * as fs from 'fs';

let compareZimmer: Zimmer;
let idList: Array<Number>;

export default class Wohnen {
    public static timer = 60000*2;
    public static disabled = false;

    public static async request(): Promise<Zimmer | undefined>{
        let page : HTTPRequest = await req({
            url: 'https://wohnen.ethz.ch/index.php?act=listfoundoffer&pid=1&kind=1&what=1&sort=2',
            method: "POST",
            headers: {
                cookie: WohnenCookie
            },
            data: `------WebKitFormBoundarySPjlA8wNACAPIorS\r\nContent-Disposition: form-data; name=\"__listfound_form_submitted\"\r\n\r\n1\r\n------WebKitFormBoundarySPjlA8wNACAPIorS\r\nContent-Disposition: form-data; name=\"sortHow\"\r\n\r\n1\r\n------WebKitFormBoundarySPjlA8wNACAPIorS\r\nContent-Disposition: form-data; name=\"MultiSortField1\"\r\n\r\n1\r\n------WebKitFormBoundarySPjlA8wNACAPIorS\r\nContent-Disposition: form-data; name=\"MultiSortField2\"\r\n\r\n0\r\n------WebKitFormBoundarySPjlA8wNACAPIorS\r\nContent-Disposition: form-data; name=\"MultiSortField3\"\r\n\r\n0\r\n------WebKitFormBoundarySPjlA8wNACAPIorS--\r\n`
        }).catch(e => { return {statusCode: -1} } );

        if(page.statusCode != 200) {
            console.log("There has been an error with the request.");
            return;
        }

        let document = new Parser(page.body ?? "");
        let lastElement = document.querySelector(".listing tr")[1]?.querySelectorAll("td");

        if(!lastElement){
            fs.writeFileSync("errorWohnen.html", page.body ?? "");
            console.log("error wohnen");
            return {error: true};
        }

        let zimmer : Zimmer = {
            id: parseInt(lastElement[1].innerText),
            title: `${lastElement[3].innerText} \\- ${lastElement[6].innerText} ${lastElement[7].innerText}`,
            body: `${lastElement[5].innerText.replace(`'`, "\\'")} CHF\nFrom ${lastElement[9].innerText} to ${lastElement[10].innerText}`,
            link: "https://wohnen.ethz.ch/" + lastElement[1].querySelector("a")?.attributes.href
        }

        if((zimmer.id ?? 0) > (compareZimmer?.id ?? 0)) {
            compareZimmer = zimmer;
            return zimmer;
        }
    }
}

function setIdList(document: Parser){
    let elements = document.querySelector('.listing tr');
    let i = elements.length;
    while (i--) i % 2 === 0 && (elements[i].remove());
    elements = document.querySelector(".listing tr td:nth-child(2)");
    return Array.from(elements).map(a => parseInt(a.innerText));

}

import HTTPRequest from "../types/request";
const reqFast = require('req-fast');
import { HTMLElement, parse } from 'node-html-parser';

export async function req(url: any) : Promise<HTTPRequest> {
    return new Promise((resolve, reject) => {
        reqFast(url, function(err: any, resp: HTTPRequest){
            if(err) reject(err);
            else resolve(resp);
        });
    })
}

export class Parser{
    body: string;
    private root: any;

    constructor(html: string){
        this.body = html;
        this.root = parse(html);
    }

    querySelector(selector: string): HTMLElement[]{
        return this.root.querySelectorAll(selector);
    }
}
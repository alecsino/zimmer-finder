import Zimmer from '../types/zimmer'

export default function(obj: Zimmer, name: string){
    return `*New ad available on ${name}*\n\n`+
    `[${obj.title?.replaceAll(".", "\\.").replaceAll("(", "\\(").replaceAll(")", "\\)")}](${obj.link})\n`+
    `${obj.body?.replaceAll(".", "\\.").replaceAll("(", "\\(").replaceAll(")", "\\)").replaceAll('-', "\\-") ?? ""}\n\n`+
    `${obj.date?.replaceAll(".", "\\.").replaceAll("(", "\\(").replaceAll(")", "\\)").replaceAll('-', "\\-") ?? ""}`
}
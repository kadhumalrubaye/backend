export class ItemDto {
    id: number
    title: string
    contetn: string
    description: string
    thumbnail: string
    link: string
    source: string
    author: string
    pubDate: string

}
export class ItemDtoWithAttr {
    id: number;
    attributes: {
        title: string
        contetn: string
        description: string
        thumbnail: string
        link: string
        source: string
        author: string
        pubDate: string,
        urgent: boolean,

    }

}
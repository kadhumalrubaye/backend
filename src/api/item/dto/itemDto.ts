export class ItemDto {
    id: number
    title: String
    contetn: String
    description: String
    thumbnail: String
    link: String
    source: String
    author: String
    pubDate: String

}
export class ItemDtoWithAttr {
    id: number;
    attributes: {
        title: String
        contetn: String
        description: String
        thumbnail: String
        link: String
        source: String
        author: String
        pubDate: String,
        urgent: boolean,

    }

}
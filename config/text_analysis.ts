import { ItemDto } from "../src/api/item/dto/itemDto";


export class TextAnalyzer {


    async cleanText(txt: string): Promise<string> {
        let text: string = '';



        //remove html charachters
        text = txt.replace("&quot;", '').replace("<br/>", "");
        // text = txt.replace(/[^a-zA-Z\s]+/g, '');

        return text;
    }
    async addItemToUrgentCategory(item: ItemDto): Promise<number[]> {
        const catName = await this.dbCatsNme();
        console.log('add item to cat start');

        const fullTxt: string = item.title.concat(' '.concat(item.contetn));
        // const categoryName: string = 'عاجل';
        let cleanedText: string;
        cleanedText = await this.cleanText(fullTxt);
        let catid: number;
        // console.log(cleanedText);
        catName.map(async (cat: string) => {
            if (cleanedText.includes(cat)) {
                console.log(`category ${cat} found`);

                try {
                    const entry = await strapi.db.query('api::category.category').findOne({

                        where: { name: cat },


                    });
                    const { id } = entry
                    catid = id;
                    // console.log(entry);
                    console.log(id);
                } catch (error) {
                    console.log(error);

                }


            }
        });



        return [catid]




    }
    async dbCatsNme(): Promise<any> {
        let names = [];
        try {
            const catsName = await strapi.db.query('api::category.category').findMany({

                select: ['name'],

            });
            catsName.map((catObj) => {
                const { name } = catObj;
                // console.log(name);
                names.push(name);

            })

        } catch (error) {
            throw new Error(error.message);

        }

        return names;
    }

}
//cat find many where name =''
//catid =cat.id
//fullTxt=item.title+item.content
//if(fullTxt.includes(urgent)){strapi.service("api:cat.cat").select('urgent').add(item)}
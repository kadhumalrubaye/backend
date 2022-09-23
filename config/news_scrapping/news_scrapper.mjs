
import axios from 'axios';
import { load } from 'cheerio';



// Get the data
const targetUrl = "https://www.alsharqiya.com/ar";
const pageResponse = await axios.get(targetUrl);

const $ = load(pageResponse.data);

$("div.article.latest-news--js").each((_, el) => {

    $(el).each((_, el) => {
        let news_items;
        news_items = el;
        console.log(news_items.attributes[0].value);
    })
});






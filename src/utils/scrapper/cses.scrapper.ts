const axios = require('axios');
const cheerio = require('cheerio');

require('dotenv').config();



async function fetchCSESData(userId:string) {
    const cookies = {
        PHPSESSID: process.env.PHPSESSID || "0e23d626ace5d7aedfcf67437ec9ceff726f9500"
    };
    // console.log(process.env.PHPSESSID)
    try {
        const response = await axios.get(`https://cses.fi/problemset/user/${userId}/`, {
            headers: {
                Cookie:  `PHPSESSID=${cookies.PHPSESSID}`,
            },
        });
    
        console.log(cheerio)

        const $ = cheerio.load(response.data);

        const solvedFullCount = $('.task-score.icon.full').length;
        
        return {total : solvedFullCount}
    } catch (error) {
        console.error('Error fetching or processing CSES data:', error);
        return { success : false}
    }
}

export default fetchCSESData;

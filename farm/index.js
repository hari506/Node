const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplateWithData = require('./modules/replaceTemplate')


let tmpOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
);

let tmpProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
);

let tmpCards = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
)

let data = fs.readFileSync(
    `${__dirname}/data/data.json`,
    'utf-8'
);

let dataObj = JSON.parse(data);


let server = http.createServer((req, res) => {
    let { query, pathname } = url.parse(req.url, true);

    switch (pathname) {
        case '/':
        case '/overview':
            let cardsHtml = dataObj.map(item => replaceTemplateWithData(tmpCards, item)).join('');
            let output = tmpOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
            res.end(output)
            break;
        case '/product':
            console.log(query.id)
            let output1 = replaceTemplateWithData(tmpProduct, dataObj[query.id]);
            res.end(output1);
            break;
        default:
            res.writeHead(404, {
                'Content-type': 'text/html',
                'Own-header': 'my-own-header'
            })

            res.end('page not found');
            break;
    }
});


server.listen(8000, '127.0.0.1', () => {
    console.log('server listening...');
})
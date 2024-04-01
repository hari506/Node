let fs = require('fs');
let http = require('http');
const replaceTemplate = require('./1-node-farm/final/modules/replaceTemplate');
const url = require('url')
/*

let inputContent = fs.readFileSync('./1-node-farm/final/txt/input.txt', 'utf-8');

console.log(inputContent);


let outputContent = "the content to write the file is : ";
let output = fs.writeFileSync('./1-node-farm/final/txt/output.txt', `the content to write the file is : ${inputContent}` )*/

let tempOverview = fs.readFileSync(
    `${__dirname}/1-node-farm/final/templates/template-overview.html`,
    'utf-8'
);

let tempProduct = fs.readFileSync(
    `${__dirname}/1-node-farm/final/templates/template-product.html`,
    'utf-8'
);
let tempCard = fs.readFileSync(
    `${__dirname}/1-node-farm/final/templates/template-card.html`,
    'utf-8'
);

let data = fs.readFileSync(
    `${__dirname}/1-node-farm/final/dev-data/data.json`,
    'utf-8'
);

let dataobj = JSON.parse(data);

let server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
    switch (pathname) {
        case '/':
        case '/overview':
            res.writeHead(200, { 'Content-type': 'text/html' })
            let cardsHtml = dataobj.map(item => replaceTemplate(tempCard, item)).join('');
            let outputStr = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml)
            res.end(outputStr);
            break;
        case '/product':
            res.writeHead(200, {
                'Content-type': 'text/html'
            })

            let productHTml = replaceTemplate(tempProduct, dataobj[query.id]);
            res.end(productHTml);

            break;
        case '/contact':
            res.end('this is contact us page routing');
            break;
        case '/api':
            res.writeHead(200, {
                'Content-type' : 'application/json'
            })

            res.end(data)
            break;
        default:
            res.writeHead(404, {
                'content-type': 'text/html',
                'my-own-header': 'hello-world'
            })
            res.end('<h1>page not found</h1>');
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('server listing')
})
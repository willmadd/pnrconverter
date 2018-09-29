const app = require('./app');
const fs = require('fs');
let http = require('http');
let https = require('https');
// let privateKey  = fs.readFileSync('/var/www/html/https-backend-node-server/public/ssl/private.key', 'utf8');
// let certificate = fs.readFileSync('/var/www/html/https-backend-node-server/public/ssl/certificate.crt', 'utf8');
// let credentials = {key: privateKey, cert: certificate};

// const port = process.env.PORT || 3000;

// app.listen(port,()=>{
//     console.log(`listening on port ${port}...`)
// })


let httpServer = http.createServer(app);
// let httpsServer = https.createServer(credentials, app);
httpServer.listen(8080, ()=>{
    console.log('listening on port 8080')
});
// httpsServer.listen(4430, ()=> {
//     console.log('listening on port 4430')
// });

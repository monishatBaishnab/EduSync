require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const port = process.env.PORT || 5000;
const connetDB = require('./src/db/dbConnect');

const main = async () => {
    await connetDB();
    app.listen(port, () => console.log('Server Running...'));
}

main();


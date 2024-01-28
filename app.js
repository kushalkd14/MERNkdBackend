const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const express = require('express')
const app = express();
dotenv.config({ path: './config.env' });
require('./db/conn');
const User = require('./db/model/userSchema');
var cors = require('cors');
app.use(express.json());
app.use(require('./router/auth'));
app.use(cookieParser);
app.use(
    cors({
        credentials: true,
        origin: 'https://mer-nkd-frontendkd.vercel.app'
    })
)
app.get('/', (req, res) => {

    res.send("hello home from server app page");

})
const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
}



app.listen(PORT, () => {
    console.log(`{connection successful ${PORT}}`);


})
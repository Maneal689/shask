const express = require('express');
const apiRouter = require('./routes/api.js');
const bodyParser = require('body-parser');
const session = require('cookie-session');

const port = process.env.PORT || 8000;

let app = express();

app.use(
    session({
        secret: 'bdVhboBUXyUn9JJsR8x4qKB1CRmEtNzH',
        name: 'session',
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static(__dirname + '/client/dist'));

//MiddleWare
app.use((req, res, next) => {
    console.log(`${req.method}: ${req.url}`);
    next();
});

//app.use('/api', apiRouter);

//app.get('*', (req, res) => {
    //res.sendFile(__dirname + '/client/dist/index.html');
//});

app.listen(port, () => console.log('Listening on port: ', port));

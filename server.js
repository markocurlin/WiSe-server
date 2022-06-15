const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser');
const dataRouter = require('./routes/data');
const mqttRouter = require('./routes/mqtt');

app.get('/', cors(corsOptions), (req, res) => {
    res.json({ "name": 'Test' });
});

app.use('/data', dataRouter);
//app.use('/mqtt', mqttRouter);

var corsOptions = {
    origin: 'https://wi-se-client.vercel.app/',
    optionsSuccessStatus: 200
}

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
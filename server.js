const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser');

app.get('/', (req, res) => {
    res.json({ "name": 'Marko1234' });
});

app.get('/marko', (req, res) => {
    res.json({ "name": 'Aaa' });
});

app.use(cors({
    origin: "https://wi-se-client.vercel.app/",
    credentials: true,
}));

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
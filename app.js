const env = require('dotenv');
const express = require('express');
const app = express();
env.config({
    path: './config.env'
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to quote management system');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
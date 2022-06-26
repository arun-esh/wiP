const fs = require(`fs`);
const express = require(`express`);

const app = express();


// Port number
const port = 3000;

app.listen(port, ()=> {
    console.log(`Application is running on port ${port} .....`);
});
const express = require('express');

const app = express();

app.get(`/`, (req, res) => {
    res.send(`<h1>Hello from the server side!</h1>`)
})

const port = 6009;
app.listen(port, () => {
    console.log(`App is running on port ${port} ......\n`)
})
const express = require('express');

const app = express();

app.get(`/`, (req, res) => {
    res.send(`Hello from the server side!`)
})

const port = 6009;
app.listen(port, () => {
    console.log(`App is running on port ${port} ......\n`)
})
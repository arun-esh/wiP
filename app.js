const fs = require(`fs`);
const express = require(`express`);

const app = express();

// this cannot be inside the event loop function.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get(`/api/v1/tours`, (req, res) => {
    // When we have status of 200 (OK)
    res.status(200).json({
        status: `success`,      // When user is successfully able to connect with the API
        results: tours.length, // length of the array sent to frontend
        data:{
            // tours is the const tours from JSON file from directory
            tours
        }
    })
})
// Port number
const port = 3000;

app.listen(port, ()=> {
    console.log(`Application is running on port ${port} .....`);
});
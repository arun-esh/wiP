const fs = require(`fs`);
const express = require(`express`);

const app = express();

app.use(express.json());

// this cannot be inside the event loop function.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  // When we have status of 200 (OK)
  res.status(200).json({
    status: `success`, // When user is successfully able to connect with the API
    results: tours.length, // length of the array sent to frontend
    data: {
      // tours is the const tours from JSON file from directory
      tours,
    },
  });
};

// GET Request
app.get(`/api/v1/tours`, getAllTours);


app.post(`/api/v1/tours`, (req, res) => {
  // We don't have database yet, this is we are doing just to see how the POST request will work.
  // We want to get the last element from the tour array to add a new one into the array.
  // Get the ID of last element in the array
  // and add one to it
  const newId = tours[tours.length - 1].id + 1;

  // Create a new tour entry

  // We have added the ID that was just created in the last step
  // It will have other data from the req body
  const newTour = Object.assign({ id: newId }, req.body);

  // push this New Tour to array
  tours.push(newTour);

  // write the file
  // We cannot use synchromous write method as we are in event loop function.
  // that will block the access to other code.

  // also we send back the newly created tour
  // 200 is for OK but 201 is for newly created element

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

// Port number
const port = 3000;

app.listen(port, () => {
  console.log(`Application is running on port ${port} .....`);
});

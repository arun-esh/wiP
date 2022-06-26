const fs = require(`fs`);
const express = require(`express`);

const app = express();

app.use(express.json());

// our inital middleware

app.use((req, res, next) => {
  console.log("Hello 👋 from Middleware ⛄️");
  next();
}
);

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

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};


const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  // push this New Tour to array
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if(req.params.id * 1 > tours.length){
    return res.status(404).json({
      status: "fail",
      message: 'Invalid Id'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>'
    }
  });
}

const deleteTour = (req, res) => {
  if(req.params.id * 1 > tours.length){
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
}


app.route(`/api/v1/tours`).get(getAllTours).post(createTour);
app.route(`/api/v1/tours/:id`).get(getTour).patch(updateTour).delete(deleteTour);


// Port number
const port = 3000;

app.listen(port, () => {
  console.log(`Application is running on port ${port} .....`);
});

const fs = require(`fs`);
const express = require(`express`);
const morgan = require('morgan');

const app = express();


// (1) MIDDELWARES
app.use(morgan('dev'));
app.use(express.json());

// our inital middleware

app.use((req, res, next) => {
  console.log("Hello 👋 from Middleware ⛄️");
  next();
}
);

// Middleware function to get the Date and time of the request
// which is applied ONLY to getAllTours function.

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});




// this cannot be inside the event loop function.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);


// (2) ROUTE HANDLERS

const getAllTours = (req, res) => {
  console.log(req.requestTime);
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


// USERS ROUTE Handlers

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: `error`,
    message: 'Get All Users: This Route is not yet defined'
  });
}

const getUser = (req, res) => {
  res.status(500).json({
    status: `error`,
    message: 'Get User: This Route is not yet defined'
  });
}

const createUser = (req, res) => {
  res.status(500).json({
    status: `error`,
    message: 'Create User: This Route is not yet defined'
  });
}

const updateUser = (req, res) => {
  res.status(500).json({
    status: `error`,
    message: 'Update User: This Route is not yet defined'
  });
}

const deleteUser = (req, res) => {
  res.status(500).json({
    status: `error`,
    message: 'Delete User: This Route is not yet defined'
  });
}

// (3) Routes

app.route(`/api/v1/tours`).get(getAllTours).post(createTour);
app.route(`/api/v1/tours/:id`).get(getTour).patch(updateTour).delete(deleteTour);

app.route(`/api/v1/users`).get(getAllUsers).post(createUser);
app.route(`/api/v1/users/:id`).get(getUser).patch(updateUser).delete(deleteUser);



// (4) SERVER
// Port number
// const port = 3000;

// app.listen(port, () => {
//   console.log(`Application is running on port ${port} .....`);
// });

module.exports = app;
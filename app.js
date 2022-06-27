const express = require(`express`);
const morgan = require('morgan');

const tourRouter = require(`./routes/tourRoutes`)
const userRouter = require(`./routes/userRoutes`)

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

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
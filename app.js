const express = require(`express`);
const morgan = require('morgan');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);

const app = express();

// (1) MIDDELWARES
app.use(morgan('dev'));

app.use(express.json());

// serve static Files
app.use(express.static(`${__dirname}/public/test`));


// Middleware function to get the Date and time of the request
// which is applied ONLY to getAllTours function.

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all(`*`, (req, res, next) => {
  next(new AppError(`Can't fine ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

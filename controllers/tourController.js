const fs = require(`fs`);
const Tour = require(`./../models/tourModel`);

exports.getAllTours = async (req, res) => {
  console.log(req.query);
  try {
    // BUILD QUERY
    // destructure the query
    const queryObj = { ...req.query };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObj[el]);

    const query = Tour.find(queryObj);
    // without any query it will just send  all as output
    // with valid query it will send the filtered output

    // EXECUTE Query
    const tours = await query;
    
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Failed',
    });
  }
};

exports.getTour = async (req, res) => {
  console.log(req.params.id);
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Get One Tour: Passed',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'GetOne Tour Failed',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

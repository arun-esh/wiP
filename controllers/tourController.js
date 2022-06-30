const fs = require(`fs`);
const Tour = require(`./../models/tourModel`);

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

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
      status: "success",
      message: "Get One Tour: Passed",
      data: {
        tour
      }
    })

  } catch (err){
    res.status(404).json({
      status: 'fail',
      message: "GetOne Tour Failed"
    })
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

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const fs = require(`fs`);
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const Tour = require(`./../models/tourModel`);

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5',
  req.query.sort = '-ratingsAverage, price',
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty',
  next();
}

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});


// exports.getAllTours = async (req, res) => {
//   console.log(req.query);
//   try {
//     // BUILD QUERY
//     // destructure the query

//     // 1. FILTERING
//     const queryObj = { ...req.query };
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     // 2. ADVANCED FILTERING
//     let queryStr = JSON.stringify(queryObj);

//     // without g it will filter only first occurence
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>  `$${match}`);
//     console.log(JSON.parse(queryStr))


     
//     // const query = Tour.find(queryObj);
//     // to make sure gte or lte are taken care of use this
//     let query = Tour.find(JSON.parse(queryStr));
//     // without any query it will just send  all as output
//     // with valid query it will send the filtered output

//     // SORTING
//     if(req.query.sort){
//       const sortBy = req.query.sort.split(`,`).join(` `);
//       console.log(sortBy)
//       query = query.sort(sortBy);
//     }else{
//       // query = query.sort(`-createdAt`);
//       query = query.sort(`price`);
//     }

//     // 3 Field limiting

//     if(req.query.fields){
//       const fields = req.query.fields.split(',').join('  ');
//       //projecting
//       query = query.select(fields)
//     }else {
//       // excluding only this __v which is used by mongoose internally
//       query = query.select(`-__v`);
//     }

//     // 4 pagination

//     // pages=2&limit=10

//     const page = req.query.page * 1 || 1;
//     const limit = req.query.limit * 1 || 100;
//     const skip = (page -1) * limit;

//     query = query.skip(skip).limit(limit);

//     if(req.query.page){
//       const numTours = await Tour.countDocuments();

//       if(skip >= numTours) throw new Error(`This page does not exist`);
//     }

//     // EXECUTE Query
//     const tours = await query;
   
    

    
//     // SEND RESPONSE
//     res.status(200).json({
//       status: 'success',
//       result: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

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

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

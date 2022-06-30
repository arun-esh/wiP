# wiP

# Section 6 Express: 

Express is a framework for building web applications and APIs. It is designed to be fast, flexible, and powerful.

## Starting our API: Handling GET requests

add Setup the API v1 along with project data files

```
url: /api/v1/tours
This will help us to build and test v2 without breaking the
system for version 1.

File systsem files will be read once and must be outside the
event loop function.

It is better to send status code with each request.
API GET Request
	localhost:3000/api/v1/tours
API GET Response
	Status
	length of the array
	Data from JSON file
```

## Importing development data

## Querying the database

```jsx
// how to check the request in the console
console.log(req.query);

// Output
{ difficulty: 'easy' }

// Hardcore the tourController.js
const tours = await Tour.find({
  duration: 5,
  difficulty: 'easy'
})

// it will show only the matching tours as we hardcoded the controller function.

const tours = await Tour.find()
.where('duration').equals(5)
.where('difficulty').equals('easy')


// without any query it will just send  all as output
// with valid query it will send the filtered output

// Lets handle the wrong query
// Create a shadow copy of req.query

const queryObj = req.query // DO NOT USE THIS
// this is reference to the req.query, so something deleted or modified 
// from the queryObj, it will do the same thing for reference object as well.

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
```



## 96. Making the API Better: Advanced Filtering

For now, users can only do query with one filter `name=test`, we want to have query like greater than or less than as well.

```jsx
query

http://localhost:3000/api/v1/tours?duration(gte)=5&difficult=easy

http://localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=1500

exports.getAllTours = async (req, res) => {
  console.log(req.query);
  try {
    // BUILD QUERY
    // destructure the query

    // 1. FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2. ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    // without g it will filter only first occurence
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>  `$${match}`);
    console.log(JSON.parse(queryStr))


     // to make sure gte or lte are taken care of use this
    // const query = Tour.find(queryObj);
    const query = Tour.find(JSON.parse(queryStr));
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
```

### SORTING

```jsx
exports.getAllTours = async (req, res) => {
  console.log(req.query);
  try {
    // BUILD QUERY
    // destructure the query

    // 1. FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2. ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);

    // without g it will filter only first occurence
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>  `$${match}`);
    console.log(JSON.parse(queryStr))


     
    // const query = Tour.find(queryObj);
    // to make sure gte or lte are taken care of use this
    let query = Tour.find(JSON.parse(queryStr));
    // without any query it will just send  all as output
    // with valid query it will send the filtered output

    // SORTING
    if(req.query.sort){
      query = query.sort(req.query.sort);
    }

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


// But if we have two collections with same price, how they are being filtered
// We need to have a second sorting filter as well in the query for the desired results

http://localhost:3000/api/v1/tours?sort=price,ratingsAverage

// with minus
http://localhost:3000/api/v1/tours?sort=price,-ratingsAverage
// now they must change their positions



exports.getAllTours = async (req, res) => {
  console.log(req.query);
  try {
    // BUILD QUERY
    // destructure the query

    // 1. FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2. ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);

    // without g it will filter only first occurence
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>  `$${match}`);
    console.log(JSON.parse(queryStr))


     
    // const query = Tour.find(queryObj);
    // to make sure gte or lte are taken care of use this
    let query = Tour.find(JSON.parse(queryStr));
    // without any query it will just send  all as output
    // with valid query it will send the filtered output

    // SORTING
    if(req.query.sort){
      const sortBy = req.query.sort.split(`,`).join(` `);
      console.log(sortBy)
      query = query.sort(sortBy);
    }

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
```


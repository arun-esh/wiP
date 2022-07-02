# wiP

# Section 6 Express: 

Express is a framework for building web applications and APIs. It is designed to be fast, flexible, and powerful.



### Eslint and other modules

```bash
npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
```



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



### Limiting Fields

```jsx
// we want user to query for certain filters, not all

// query: http://localhost:3000/api/v1/tours?fields=name,duration,difficulty,price

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
    }else{
      // query = query.sort(`-createdAt`);
      query = query.sort(`price`);
    }

    // 3 Field limiting

    if(req.query.fields){
      const fields = req.query.fields.split(',').join('  ');
      //projecting
      query = query.select(fields)
    }else {
      // excluding only this __v which is used by mongoose internally
      // if you want to disable something, disable in schema
      // select: false
      // don't disable __v 
      query = query.select(`-__v`);
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


// to disable any field from the database, it is better to use the schema.

```



### Pagination

```jsx
http://localhost:3000/api/v1/tours?page=1&limit=3


http://localhost:3000/api/v1/tours?page=2&limit=3


```



### Special Route

```jsx
// alias route
// query: http://localhost:3000/api/v1/tours/top-5-cheap

// Created a new route under route folder which will point to aliasTopTours
router.route(`/top-5-cheap`).get(tourController.aliasTopTours, tourController.getAllTours)

// aliasTopTours is a middleware which will run before the getAll Tours
// rather than writing more code for new route, we just added middleware to existing route getAllTours
// there are know two route for getAllTours
// if there will be any URL for /top-5-cheap, it will run the middleware first aliasTopTours 

// method is under controller
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5',
  req.query.sort = '-ratingsAverage, price',
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty',
  next();
}
```



## Document Middleware

Mongoose also has the concept of middleware. It is one of many middleware of the mongoose. Mongoose middleware, is same as middleware in Express, to make something happen between two events.

For example, each time a new document is saved to the database, we can run a function between the save command is issued and the actual saving

of the document, or also after the actual saving. And that's the reason why Mongoose middleware is also called pre and post hooks.

So there are four types of middleware in Mongoose: 

* document
* query
* aggregate, and 
* model middleware

Document middleware, which is middleware that can act on the currently processed document.

So just like the virtual properties, we define a middleware on the schema.

```jsx
// tourModels.js
tourSchema.pre('save', function(){		// event is save event
 // function is coming in future
});
```

This function will be called before an actual document is saved to the database.

**So if we use save event command with insertMany, then that will actually not trigger the save middleware.**

Only on save and on create actually this middleware will be executed.

```jsx
// tourModels.js
tourSchema.pre('save', function(){		// event is save event
 console.log(this)  // points to current document
});

// Create a new codument and it will trigger

// Console output

[nodemon] starting `node server.js`
App running on port 3000...
DB connection successful!
Hello from Middleware
{
  ratingsAverage: 4.7,
  ratingsQuantity: 37,
  images: [ 'tour-1-1.jpg', 'tour-1-2.jpg', 'tour-1-3.jpg' ],
  createdAt: 2022-07-01T15:36:06.056Z,
  startDates: [
    2021-04-25T14:00:00.000Z,
    2021-07-20T14:00:00.000Z,
    2021-10-05T14:00:00.000Z
  ],
  secretTour: false,
  _id: 62bf147e70b3144442c04e5d,
  name: 'The Forest Hiker111',
  duration: 5,
  maxGroupSize: 25,
  difficulty: 'easy',
  price: 397,
  summary: 'Breathtaking hike through the Canadian Banff National Park',
  description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n' +
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  imageCover: 'tour-1-cover.jpg',
  id: '62bf147e70b3144442c04e5d'
}
POST /api/v1/tours 201 214.726 ms - 1022
```

This happened just before we saved the document to the database. At this point of time, we can still act on the data before it is then saved to the database and that is exactly.

I wanna do here is to create a **slug** for each of these documents. A slug is basically just a string that we can put in the URL, usually based on some string like the name.

## Install `slugify`

```jsx
// Install the slugify
npm i slugify

// tourModel.js

const slugify = require('slugify');

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
```

Create a new document to check the setup, slug is not visible in newly created document. The reason why it's not working is that right now we don't have any slug in our schema. The fields which are not defined in the schema, will be ignored by default. And when we, then we'll define some fields. Here we defined the slug property, but it's not in our schema.

```jsx
// add slug to the schema after name in tourModel.js

slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
// Now create a new document
      
      
// Document Created

{
    "status": "success",
    "data": {
        "tour": {
            "ratingsAverage": 4.7,
            "ratingsQuantity": 37,
            "images": [
                "tour-1-1.jpg",
                "tour-1-2.jpg",
                "tour-1-3.jpg"
            ],
            "createdAt": "2022-07-01T16:07:50.972Z",
            "startDates": [
                "2021-04-25T14:00:00.000Z",
                "2021-07-20T14:00:00.000Z",
                "2021-10-05T14:00:00.000Z"
            ],
            "secretTour": false,
            "_id": "62bf1be37052ad4520a17ad0",
            "name": "The Forest Hiker11341",
            "duration": 5,
            "maxGroupSize": 25,
            "difficulty": "easy",
            "price": 397,
            "summary": "Breathtaking hike through the Canadian Banff National Park",
            "description": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "imageCover": "tour-1-cover.jpg",
            "slug": "the-forest-hiker11341",
            "__v": 0,
            "id": "62bf1be37052ad4520a17ad0"
        }
    }
}
```



Let's now just very quickly experiment, with a post middleware. So tourSchema.post and let's use save again.



```jsx
tourSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
});

```



In the case of post middleware has access not only to next, but also to the document that was just saved to the database. So let's call that one doc and then next. And so post middleware functions are executed after all the pre middleware functions

have completed, all right.

So in here we actually no longer have the disk keyword,

but instead we have the basically finished

document here in doc.

So let's just log that finished document

to the console and then call next.

Now in this case again, we only have one

post middleware and so we wouldn't really need next,

but it's a best practice to simply always include it.

Now another thing that I wanted to show you

is that we can have, of course, multiple

pre middlewares or also post middlewares for the same hook.

And hook is what we call this save here.

So this middleware here is basically what we call

a pre save hook.

So you will see that terminology all the time.

So some call it middleware, and some call it hooks.

And so this is gonna be a pre save hook

or pre save middleware.

So function, and this one has access to next.

And so let's just log something to the console here,

like will save document.

And then next, and that of course, should be next.

Just to see if we get some error,

I'm gonna omit the next here.

Just to see what happens when we do not call it.

So I'm gonna create a new tour,

and by the end of this lecture I'm gonna delete

all of them, but for now we need them here.

And so now you see that it's not really finishing,

so we're stuck in that one middleware function

that doesn't have the next call.

So basically we're stuck in here.

So let's cancel the request

and then get it back here,

and try that again.

And so now it worked indeed.

So our slug is here, right,

and so let's take a look at our console,

and so indeed, our second pre middleware also run,

so the one logging will save document and then

our post middleware then logged to the console

the final document, and so that should also

already have the slug and yeah, here it is.

And that's actually all I had to show you

about document middleware.

Now I'm just gonna comment out these two here

because I don't want to pollute my log here

all the time with these console.logs,

but I'm still keeping them here, again,

as a reference.

So what I want you to remember from this lecture

is that we can have middleware running before

and after a certain event.

And in the case of document middleware,

that event is usually the save event.

And then in the middleware function itself,

we have access to the disk keyword,

which is gonna point at the currently being saved document.

And it's also very important to keep in mind

that this save middleware only runs for the save

and create Mongoose methods.

It's not gonna run, for example, for insert many

and also not for find one and update

or find by ID and update, which we already used before.

So for example, we somewhere here we have

we have findByIdAndUpdate, but that is not gonna trigger

this save middleware.

So that's very important to keep in mind

because actually a bit later in this project,

we will have to work around that limitation.

All right, so this is document middleware

to manipulate documents that are currently being saved.

Next up, we're gonna talk about query middleware.

 

 


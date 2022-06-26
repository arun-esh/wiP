# wiP

# Section 6 Express: Let's start building the Natours API



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



## Handling POST Requests

By default, express does not put body data on the request. In order to use that data we need to use middleware.

Just added some temporary middleware for now.

```jsx
app.use(express.json())
```

Middleware is just a function which can modify the incoming data. It is called middlewre because it sits between request and response.

**Testing:**

​	I sent the data without the middileware specified and I got the `undefined` in the console.

​	If our request is going to have JSON data, then middleware should be JSON. 

If that is going to be TEXT, then it will be text

```
app.use(express.text())
```





```jsx
// starting from app.js

app.post(`/api/v1/tours`, (req, res) => {
    console.log(req.body);
    res.send('Done');
})

// Making changes 

// We don't have database yet, this is we are doing just to see how the POST request will work.
// We want to get the last element from the tour array to add a new one into the array.

// Get the ID of last element in the array
// and add one to it
const newId = tours[tours.length -1].id + 1

// Create a new tour entry

// We have added the ID that was just created in the last step 
// It will have other data from the req body
const newTour = Object.assign({ id: newId}, req.body);

// push this New Tour to array
tours.push(newTour);

// write the file
// We cannot use synchromous write method as we are in event loop function.
// that will block the access to other code.
fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`)

// we also need to stringify the data 
// tours-simple is json file and Tour is an javascript object, so  we need to stringify it.




```



We never update the ID which will be taken care by the database. 



## Refactoring Routes



Export all these handler functions into their own function.

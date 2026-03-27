// Asynchronous JavaScript with Event Loop

// Task 1: Simulating Asynchronous Behavior
// Create a function simulateAsyncTask() that logs “Task started”, then after 2 seconds logs “Task finished”.
// Use setTimeout to simulate this behaviour.

function simulateAsyncTask() {
    console.log("Task started");
    
    setTimeout(() => {
     console.log("Task finished");
    }, 2000);
}



// Task 2: Simulate Multiple Async Tasks with Different Delays
// Create a function simulateMultipleTasks() that starts three asynchronous tasks with different delays (1 second, 2 seconds, and 3 seconds).
// Each task should log "Task [n] finished" where [n] is the task number. Ensure the tasks run asynchronously.

function simulateMultipleTasks() {
    setTimeout(() => {
        console.log("Task 1 finished");
    }, 1000);
    
    setTimeout(() => {
        console.log("Task 2 finished");
    }, 2000);
    
    setTimeout(() => {
        console.log("Task 3 finished");
    }, 3000)
}



// Task 3: Async Task with Callback Function
// Create a function fetchDataWithCallback(callback) that simulates fetching data asynchronously using setTimeout (after 2 seconds).
// Once the data is “fetched”, it should invoke the provided callback function with "Fetched data" as an argument.

function fetchDataWithCallback(callback) {
    setTimeout(() => {
        const data = "Fetched data";
        callback(data);
    }, 2000);
}




// Closures in JavaScript

// Task 1: Creating a Counter Using Closures
// Create a function createCounter() that returns a function which increments and returns a counter value each time it is called.

function createCounter() {
    let counter = 0
    function inner(){
        counter ++;
        return counter;
    }
  return inner;
}



// Task 2: Rate Limiter Function
// Create a function rateLimiter(fn, limit) that returns a new function. The returned function allows calling fn only once within a limit time in milliseconds. If it is called again before the limit is reached, it should return "Rate limit exceeded".

function rateLimiter(fn, limit) {
    let lastCalled = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCalled < limit) {
      return "Rate limit exceeded";
    }

    lastCalled = now;
    return fn(...args);
  };
    
}



// Task 3: Memoization Function
// Write a function memoize(fn) that returns a memoized version of fn. The memoized function should cache the results of function calls, and return the cached result if the same inputs are provided again.

function memoize(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache[key] !== undefined) {
      return cache[key];
    }

    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}




// Prototypal Inheritance in JavaScript

// Task 1: Create Inheritance Using Prototypes
// Create a constructor Animal with a method makeSound(). Then create a constructor Dog that inherits from Animal and adds a method bark()

function Animal() {
}

Animal.prototype.makeSound = function (){
    return "Animal sound";
}

function Dog() {
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    return "Woof!";
}



// Task 2: Shape and Rectangle Inheritance
// Create a constructor function Shape that takes color as a parameter and has a method getColor() that returns the color.
// Create another constructor Rectangle that inherits from Shape and adds properties width and height. Add a method getArea() to Rectangle that returns the area of the rectangle.

function Shape(color) {
    this.color = color;
}

Shape.prototype.getColor = function(){
    return this.color;
}

function Rectangle(width, height, color) {
    this.width = width;
    this.height = height;
    Shape.call(this, color);
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.constructor = Rectangle;

Rectangle.prototype.getArea = function(){
    return this.width * this.height;
}



// THIS and Binding Context

// Task 1: Bind the Correct Context
// Create an object person with properties name and a method introduce(). Use the bind() method to ensure the method works correctly when passed to another function.

const person = {
    name: "Alice",
    introduce(){
        return `Hi, my name is ${this.name}`;
    }
};

const boundIntroduce = person.introduce.bind(person);



// Task 2: Using call() to Invoke a Function with Different Contexts
// Write a function introduce() that uses the this keyword to introduce a person by name. Then, invoke introduce() using call() to introduce different people with the same function.

function introduce() {
    return `Hi, my name is ${this.name}`;
}

const person1 = {name: "Hannah"};
console.log(introduce.call(person1));



// Task 3: Using apply() to Pass Arguments with Context
// Create a function sum() that accepts two numbers and uses this to access a multiplier value. Then, invoke sum() with different contexts using apply(), passing the numbers as an array.

function sum(a, b) {
    return (a + b) * this.multiplier;
}

const context1 = {multiplier: 2};

console.log(sum.apply(context, [4, 6]));




// Async-Await and Promise.all

// Task 1: Async-Await with Promise.all
// Create two functions fetchUser() and fetchPosts(), both returning promises that resolve in 1 second.
// Use async-await and Promise.all to fetch both simultaneously and log the results as part of fetchAllData()

function fetchUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("User data");
        }, 1000);
    });
}

function fetchPosts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Posts data");
        }, 1000);
    });
}

async function fetchAllData() {
    try{
        const [user, posts] = await Promise.all([
            fetchUser(),
            fetchPosts()
            ]);
            
      console.log(user);
      console.log(posts);
        
    }catch(error){
        console.log("Error fetching data:", error);
    }
}



// Task 2: Error Handling in Async/Await with Promise.all
// Write two functions fetchSuccess() and fetchFailure(), where fetchSuccess() returns a promise that resolves successfully after 1 second, and fetchFailure() returns a promise that rejects with an error after 1 second.
// Create a function handlePromises() that calls both functions using Promise.all and handles success and failure cases.

function fetchSuccess() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Fetch Successfully");
        }, 1000);
    });
}

function fetchFailure() {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject("Error occurred");
        }, 1000);
    });
}

async function handlePromises() {
  try {
      const results = await Promise.all([
          fetchSuccess(), fetchFailure()]);
  } catch (error) {
    console.log(error);
  }
}



// Task 3: Timeout with Async/Await and Promise.race
// Create a function fetchWithTimeout(promise, timeout) that takes a promise and a timeout value in milliseconds. Use Promise.race() to return the result of the promise if it resolves within the timeout, otherwise return "Timeout exceeded".

function fetchWithTimeout(promise, timeout) {
  return new Promise(function (resolve) {
    Promise.race([promise])
      .then(function (value) {
        resolve(value);
      });

    setTimeout(function () {
      resolve("Timeout exceeded");
    }, timeout);
  });
}

function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data fetched");
    }, 3000);
  });
}




// Iterators and Generators in JavaScript

// Task 1: Creating a Simple Generator
// Create a generator function numberGenerator() that yields numbers from 1 to 3.

function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
}



// Task 2: Create a Custom Iterator
// Create a custom iterator called rangeIterator(start, end) that returns an object that iterates over numbers from start to end.
// Each call to .next() should return the next number in the range until it reaches end.

function rangeIterator(start, end) {
    let current = start;
    
    return {
        next(){
            if(current <= end){
                return{value: current++, done: false};
            }else{
                return{value: undefined, done: true};
            }
        }
    }
}



// Task 3: Generator Function for Fibonacci Sequence
// Create a generator function fibonacciGenerator() that yields numbers from the Fibonacci sequence indefinitely (1, 1, 2, 3, 5, 8, etc.).
// Use the next() method to get the next Fibonacci number.

function* fibonacciGenerator() {
    let a = 1;
    let b = 1;
    
    while(true){
        yield a;
        [a, b] = [b, a + b];
    }
}






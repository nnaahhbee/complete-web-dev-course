// Write a function stringToNumber that takes a string input and tries to convert it to a number. If the conversion fails, return "Not a number".
function stringToNumber(input) {
   const num = Number(input);
   
   if(isNaN(num)){
       return "Not a number";
   }
   
   return num;
}
console.log(num);



// Write a function flipBoolean that takes any input and converts it to its boolean equivalent, then flips it. For example, true becomes false, 0 becomes true, etc.
function flipBoolean(input) {
    const bool = Boolean(input);
    
    return !bool;
}



// Write a function whatAmI that takes an input and returns a string describing its type after conversion. If it's a number, return "I'm a number!", if it's a string, return "I'm a string!"
function whatAmI(input) {
    if(typeof input === "number") return "I'm a number!";
    if(typeof input === "string") return "I'm a string!";
}



// Write a function isItTruthy that takes an input and returns "It's truthy!" if the value is truthy in JavaScript, or "It's falsey!" if it's falsey.
function isItTruthy(input) {
    if(input){
        return "It's truthy!";
    }else{
        return "It's falsey!"
    }
}




// **** DO NOT CHANGE the values *****
const a = 18;
const b = 24;

// Addition of two values
function add() {
    return a + b;
}

// Subtract small value from larger one
function subtract() {
    return b - a;
}

function multiply() {
    return a * b;
}

// Divide larger value by small
function divide() {
    return b / a;
}

// Increase value of a by 1
function increment() {
    return a + 1;
}

// Decrease value of b by 1
function decrement() {
    return b - 1;
}

// Divide larger value by small to find the reminder
function reminder() {
    return b % a;
}




// Write a function filterNumbers(arr) that returns only numbers from a mixed array
function filterNumbers(arr) {
  return arr.filter(item => typeof item === 'number');
}


// Write a function reverseArray(arr) that reverses the array
function reverseArray(arr) {
  return arr.reverse();
}


// Write a function findMax(arr) that returns the largest number in the array
function findMax(arr) {
  return Math.max(...arr);
}


// Write a function removeDuplicates(arr) that returns a new array with all duplicates removed
function removeDuplicates(arr) {
  return [...new Set(arr)];
}


// Write a function flattenArray(arr) that takes a nested array and returns a single flattened array
function flattenArray(arr) {
  return arr.flat(Infinity);
}


// Write a function sumOfN(n) that returns the sum of the first n natural numbers
function sumOfN(n) {
  return n * (n + 1) / 2;
}


// Write a function printMultiplicationTable(n) that returns the multiplication table for n. Values return in the array must be of the format 2 * 2 = 4
function printMultiplicationTable(n) {
    const table = [];
    for(let i = 1; i <= 10; i++){
        table.push(`${n} * ${i} = ${n * i}`);
    }
  return table;
}


// Write a function countVowels(str) that returns the number of vowels (in both lower & uppercase) in the given string str.
function countVowels(str) {
    const vowels = "aeiouAEIOU";
    let count = 0;
    for(let char of str){
        if(vowels.includes(char)){
            count++;
        }
    }
    
  return count;
}



// Write a function squareNumbers(arr) using map() and arrow functions
const squareNumbers = (arr) => arr.map(num => num * num);


// Create a function filterEvenNumbers(arr) using filter() and arrow functions
const filterEvenNumbers = (arr) => arr.filter(num => num % 2 === 0);


// Write a function sumPositiveNumbers(arr) that takes an array of numbers and returns the sum of all positive numbers using filter() and reduce() with arrow functions
const sumPositiveNumbers = (arr) => arr.filter(num => num > 0).reduce((sum, num) => sum + num, 0);


// Write a function getNames(arr) that takes an array of objects where each object has a name property, and returns an array of just the names using map() and arrow functions
const getNames = (arr) => arr.map(obj => obj.name);


// Write a function findLongestWord(arr) that takes an array of strings and returns the longest word using reduce() and an arrow function
const findLongestWord = (arr) => arr.reduce((longest, current) => current.length > longest.length ? current : longest, "");




// Create an object person with a method introduce() that uses this
const person = {
    name: "Hitesh",
    age: 19.5,
    introduce(){
        return `Hi, my name is ${this.name} and I am ${this.age} years old`;
    }
};


// Write a function outer() that contains another function inner() and returns a value of 'Inner function called' on calling outer()
function outer() {
    function inner(){
        return "Inner function called";
    }
     return inner();
}
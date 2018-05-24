for (var i = 0; i < 10; i++) {
    setTimeout(function() { console.log(i); }, 100 * i);
} // Prints 10 ten times

for (var i = 0; i < 10; i++) {
    // capture the current state of 'i'
    // by invoking a function with its current value
    (function(i) {
        setTimeout(function() { console.log(i); }, 100 * i);
    })(i);
} // uses IIFE (immediately invoked function expression)
// captures i at each iteration, prints 1 2 3 4 ... 10
// completely unnecessary in Typescript

for (let i = 0; i < 10; i++) {
    setTimeout(function() { console.log(i); }, 100 * i);
} // Prints 1 2 3 4 ... 10 ten times

// An example using let that showcases block (lexical)-scoping
function f(input: boolean) {
    let a = 100;

    if (input) {
        // Still okay to reference 'a'
        let b = a + 1;
        return b;
    }

    // Error: 'b' doesn't exist here
    // return b;
}

// Another example using let that showcases block (lexical)-scoping
try {
    throw "oh no!";
}
catch (e) {
    console.log("Oh well.");
}
// Error: 'e' doesn't exist here
// console.log(e);

// Yet another example using let that showcases block (lexical)-scoping
// a++; // illegal to use 'a' before it's declared;
let a;


// Figure out why exactly this works. Docs say 
// it's a distinctly different block, but idk
function g(condition, x) {
    if (condition) {
        let x = 100;
        return x;
    }

    return x;
}
g(false, 0); // returns '0'
g(true, 0);  // returns '100'


// Shadowing is introducing a new name in a more nested scope
function sumMatrix(matrix: number[][]) {
    let sum = 0;
    for (let i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        // works bc the following i "shadows" the outer i
        for (let i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }

    return sum;
} // really, try not to shadow, it's rarely an advantage


// Destructuring
// ARRAY DESTRUCTURING
let input = [1, 2];
let [first1, second1] = input;
console.log(first1); // outputs 1
console.log(second1); // outputs 2
first1 = input[0];
second1 = input[1];


// Destructuring with already-declared variables
// swap variables
[first1, second1] = [second1, first1];


// Destructuring with function parameters
function h([first, second]: [number, number]) {
    console.log(first);
    console.log(second);
}
h([1, 2]);


// Destructuring using ... syntax
let [first2, ...rest] = [1, 2, 3, 4];
console.log(first2); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]
// or just ignore the trailing elements
let [first3] = [1, 2, 3, 4];
console.log(first3); // outputs 1
// or pick certain elements
let [, second4, , fourth4] = [1, 2, 3, 4];


// OBJECT DESTRUCTURING
// Creates a new variable d and e form o.d and o.e
// Skip f if you'd like
let o = {
    d: "foo",
    e: 12,
    f: "bar"
};
let { d, e } = o;

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
// captures i at each iteration


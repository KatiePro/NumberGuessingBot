/* Number Guessing Bot
 * 
 * Generates a random number 1-20 for the user to guess.
 * 
 * Notifies user each time if their guess was correct, too high, or too low.
 */

var restify = require('restify');
var builder = require('botbuilder');
var guessAttempts = 0;
var randomNumber = 0;


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    if (guessAttempts >= 1) {
        var guess = session.message.text;
        if (isValidNumber(guess)) {
            evaluateGuess(guess, session);
        } else {
            session.send("That wasn't a valid number, try again.");
        }
    } else if (guessAttempts == 0) {
        initialize(session);
    } else {
        session.send("Hmm... Something went wrong, let's start over.");
    }
});

function initialize(session) {
    session.send("Welcome to the number guessing game! Guess a number from 1-20.");
    randomNumber = Math.floor(Math.random() * 20) + 1;
    guessAttempts = 1;
}

function isValidNumber(guess) {
    // The guess is an integer within range
    if (guess <= 20 && guess >= 1) {
        return true;
    }
    // The guess is not an integer within range
    return false;
}

function evaluateGuess(guess, session) {
    if (guess < randomNumber) {
        guessAttempts++;
        session.send("The number is higher.");
    }
    else if (guess > randomNumber) {
        guessAttempts++;
        session.send("The number is lower.");
    }
    else if (guess == randomNumber) {
        session.send('You are correct!')
        session.send('You found the right answer in ' + guessAttempts + ' tries. Good work!');
        initialize(session);
    }
    else {
        return "I couldn't evaluate your guess for some reason."
    }
}
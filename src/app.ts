// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BotFrameworkAdapter, BotStateSet, ConversationState, MemoryStorage, TurnContext, UserState, StoreItem } from "botbuilder";
import { } from "botbuilder-dialogs";
import * as restify from "restify";

// Create server
const server: any = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    // tslint:disable-next-line:no-console
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD,
});

// Add state middleware
const storage = new MemoryStorage();
const convoState = new ConversationState(storage);
const userState = new UserState(storage);
adapter.use(new BotStateSet(convoState, userState));

// Initialize variables for program logic
let guessAttempts: number = 0;
let randomNumber: number = 0;

// Listen for incoming requests
server.post("/api/messages", (req: any, res: any) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, async (context: TurnContext) => {
        // const state = convoState.get(context);
        // const count = state!.count === undefined ? state!.count = 0 : ++state!.count;
        if (context.activity.type === "message") {
            const guess = context.activity.text;
            // tslint:disable-next-line:no-console
            guessAttempts = evaluateGuess(guess, guessAttempts, context);
            // await context.sendActivity(`${count}: You said "${context.activity.text}"`);
        } else if (context.activity.type === "conversationUpdate" && context.activity.membersAdded![0].name !== "Bot") {
            randomNumber = await initialize(context);
        }
    });
});

function initialize(context: any) {
    randomNumber = Math.floor(Math.random() * 20) + 1;
    context.sendActivity("Welcome to the number guessing game! Guess a number from 1-20.");
    return randomNumber;
}

function evaluateGuess(guess: string, guessAttempts: number, context: any): number {
    if (isNaN(Number(guess))) {
        context.sendActivity("Numbers only, please");
        return guessAttempts;
    } else if (Number(guess) > 20 || Number(guess) < 1) {
        context.sendActivity("Your guess should be between 1 and 20");
        return guessAttempts;
    } else if (Number(guess) < randomNumber) {
        context.sendActivity("The number is higher.");
        return guessAttempts++;
    } else if (Number(guess) > randomNumber) {
        context.sendActivity("The number is lower.");
        return guessAttempts++;
    } else if (Number(guess) === randomNumber) {
        context.sendActivity("You are correct!");
        guessAttempts++;
        context.sendActivity("You found the right answer in " + guessAttempts + " tries. Good work!");
        initialize(context);
        return 0;
    } else {
        context.sendActivity("I couldn't evaluate your guess for some reason.");
        return guessAttempts;
    }
}

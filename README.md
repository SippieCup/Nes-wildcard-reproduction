# Nes-wildcard-reproduction
Reproduction of issues using NES on wildcard routes.


## Installation

`npm install`

## Issue



When adding subscriptions to the listener, wildcard paths are not handled correctly in internals.Subscribers.prototype.add . This leads to internals.Listener.prototype._publish incorrectly determining which subscribers to send the message to, due to only checking for length, and not number of parameters as wildcard parameters appear in the paramsArray as a single string and must be manually split.

This means that you can't have a greedy listener, or optional params as they won't match when going backwards, since they originally have 0 parameters provided or has multiple parameters merged within the last value of match.paramArray.

This does not match the Hapi routing spec. which is greedy in nature.


## Reproduction

Note: this reproduction only shows the issue for an optional parameter and it is much easier to understand. please check the wildcard branch for a demonstration of the same behavior with multiple parameters.

Run the server, and open two clients. Observe how client 1 never gets any messages.

### build & run the server 

`npm run build`
`npm start`

this will publish a random value into the `item` subscription every second with the `id` of 1 or 2.


### Run clients

Use ts-node (or native typescript file running) to run client.ts

#### Client 1

`npx ts-node client.ts --object items` 

Desired behavior: This should recieve a message every time any item is published.

Actual behavior: This never recieves a message.


#### Client 2

`npx ts-node client.ts --object items --id 1` 

Desired behavior: This should recieve a message every time item with `id` of 1 gets published. should not get other messages

Actual behavior: Works as intended.
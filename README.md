# Payments API

This api is just a demo that was done in 4,5hours(from 5pm to 7h30pm June 25, 2018 AND from 5am to 7am June 26).
It contemplates creation of users, collectives as well as

## Starting guide

We are using the following tools:

- [Fastify](https://github.com/fastify/fastify) as the main Nodejs framework
- [Typescript](https://www.typescriptlang.org/)
- [MongoDb](https://www.mongodb.com/)
- [TSLint](https://palantir.github.io/tslint/)
- [Docker](https://www.docker.com/what-docker)
- [ApiDoc](http://apidocjs.com/) to automatically generate documentation

## Running the project Without Docker

To run the project locally you will need [MongoDb](https://www.mongodb.com/).
If you want to change the port or any other configuration go to the file `src/config/config.ts` and change whatever you need.

- `npm install`
- `npm run build`
- `npm run docs`
- `npm start`(this one already runs the build so you can skip the second command)

If you want your project to be updated every change you make, just use:

- `npm run watch` instead of `npm start`.

Then you'll have your server running on the port it's going to show up on the terminal. 

## Running the project Using Docker

To run the project with Docker you will need to install Docker first. To install docker, go to the [Docker official website](https://www.docker.com/get-docker).

To simplify things, we are using [docker-compose](https://docs.docker.com/compose/) that will build the payment-api and the mongo container. To build the docker image and run the docker-compose file just use the following script:

- `start-docker`

There are other `docker` scripts defined on the `package.json` files:

- `build-docker`: build the image of your project so you can start running containers with it;
- `start-docker-only-api`: start your project's container, by default the port `3000` is exposed which is the same default of the config file;
- `stop-docker`: stop the container;

## Database Structure

### Users

Regular users of the system(contributors/creators): 

```
{
  name : { type: String, required: true, unique: true },
  email : { type: String, required: true, unique: true },
  password : { type: String, required: true },
}
```

### PaymentProcessors

Wheneve a user or a collective do a transaction, they need to pay fees to certain institution that are stated in this collection: 

```
{
  collectivePays : { type: Boolean },
  name : { type: String, required: true },
  txFixValue : { type: Number},
  txPercent : { type: Number },
  userPays : { type: Boolean },
}
```

## Collectives

The projects where people can contribute :

```
{
  contributors : { type: [userSchema] },
  creator: {type: userSchema, required: true},
  currentBalance : { type: Number, default: 0 },
  description : { type: String },
  title : { type: String, required: true },
  transactions : { type: [collectiveTransactionSchema] },
}
```

## CollectiveTransaction

A transaction related to a Collective. It's good to state that we are using fee transactions on the top of this transaction. So everytime a user contributes to a project, it will generate 1 collectiveTransaction and N feeTransactions where N is the number of paymentProcessors the system is using.

```
{
  collectiveId : { type: String, required: true},
  feeCollectiveTransactions: { type: [feeCollectiveTransactionSchema]},
  userId : { type: String, required: true},
  value : { type: Number },
}

```

## FeeCollectiveTransaction

It's generated through a CollectiveTransaction looking for the PaymentProcessors.

```
{
  collectiveTransactionId : { type: String, required: true },
  paymentProcessor : { type: paymentProcessorsSchema, required: true},
  value : { type: Number, required: true },
}
```

## Endpoints

The best way to understand the project endpoint is going through the documentation endpoint (by default `http://localhost:3000/documentation`) after having the api started. But I will 

### POST users

creates a user. example:
- `curl -H "Content-Type: application/json" -X POST --data '{"email": "user1@gmail.com", "name":"user1", "password":"user1test123"}' http://localhost:3000/users`
- `curl -H "Content-Type: application/json" -X POST --data '{"email": "user2@gmail.com", "name":"user2", "password":"user2test123"}' http://localhost:3000/users`

### GET users/:id

returns a user given an Id.example: 

- `curl http://localhost:3000/users/5b3213ade900c94e659fd77c`

### GET users/

Returns all users. You can query using url query parameter.

- `curl http://localhost:3000/users`

### POST /users/:userId/collectives

User creates a collective.

- `curl -H "Content-Type: application/json" -X POST --data '{"description": "description of collective", "title":"title of collective"}' http://localhost:3000/users/5b3213a7e900c94e659fd77b/collectives`

### POST /users/:userId/collectives/:collectiveId

a User contribute to a project through this endpoint. the only field needed on the payload is the value.

- `curl -H "Content-Type: application/json" -X POST --data '{"value": 2000}' http://localhost:3000/users/5b3213a7e900c94e659fd77b/collectives/5b3213d8e900c94e659fd77d`

### POST collectives

creates a collective, you need the user id and will set in the payload as `creatorId`. example:
- `curl -H "Content-Type: application/json" -X POST --data '{"description": "description of collective", "title":"title of collective", "creatorId":"5b3213a7e900c94e659fd77b"}' http://localhost:3000/collectives`

### GET collectives/:id

returns a collective given an Id.example: 

- `curl http://localhost:3000/collectives/5b3213ade900c94e659fd77c`

### GET collectives/

Returns all collectives. You can query using url query parameter.

- `curl http://localhost:3000/collectives`


  fastify.post("/collectives/:collectiveId/users/:userId", async (request, reply) => {

### POST /collectives/:collectiveId/users/:userId

a Collective sends money to a user. example:

- `curl -H "Content-Type: application/json" -X POST --data '{"value": 500}' http://localhost:3000/collectives/5b3213d8e900c94e659fd77d/users/5b3213a7e900c94e659fd77b`

## Running Tests

PS: I have configured the tests but did not have time to start working on tem
To only run the unit tests:

- `npm install`
- `npm run build`
- `npm run tests`(this one already runs the build so you can skip the second command)

One Observation is we are using [istanbul](https://github.com/gotwarlost/istanbul) to code coverage.

If you want to run the unit tests of a specific file, run the following command(instead of the third one above) :

- `node_modules/tape/bin/tape ./bin/PATH_OF_YOUR_FILE`

And If you want to run the unit tests AND the code coverage of a specific file :

- `node_modules/.bin/istanbul cover node_modules/tape/bin/tape ./bin/PATH_OF_YOUR_FILE`

## Generating documentation

To generate the documentation of the project, run:

- `npm install`
- `npm run build`
- `npm run docs`

We are using the [apidoc](http://apidocjs.com/) documentation generator framework.

If you want to add documentation to a specific endpoint or function, you will need to use `comments` within your code, here's an example:

```javascript

/**
 * @api {get} /ping Healthcheck
 * @apiName Ping
 * @apiGroup Status
 *
 * @apiSuccess pong if your API works.
 */
fastify.get("/ping", (request, reply) => {
    request.log.info("Ping completed successfully");
    reply.code(200).send({ ping: "pong" });

});

```

## Running TSLint

TSLint is an analysis tool that checks TypeScript code for readability, maintainability, and functionality errors. It helps keeps the standard of the project.

To run the TSLint, do:

- `npm run tslint`

## Before commiting

Just commit if everythings is ok with the following commands:

- `npm run tests`
- `npm run tslint`
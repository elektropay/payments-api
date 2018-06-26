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

## Why did I choose these tools and structure:

1. framework : I believe fastify is a quite well [performing framework](https://github.com/fastify/benchmarks) to build APIs with nodejs and makes it easy adding their plugins and decorators system. Even though is not the fastest in the benchmark, it offers the basic tools necessary to build a scalable api.
2. database: I've chosen mongodb because, to be honest, it's a great Nosql database that makes it easy and fast to store nested data(which was the choice I used given Nosql database are not great to keep doing joins). But I do believe that relational databases like postgresql or mysql would make more sense at least in the payments parts as we need ACID to make sure transactions went through or didn't. If I had time I would actually use an immutable database like [datomic](https://www.datomic.com/) so once the data is there it can never be deleted(which makes a lot of sense for payments and super sensitive and risky information).  I would still keep using Nosql(Perhaps ElasticSearch or even Mongo) but only for reading operations, so whenever someone writes in the database it would go straight to the relational or immutable database but the Nosql would also be indexing the data so all the frontend would query only once. GraphQL might be a wise choice as well. 
3. typescript: Even though my code wasn't completely typescript compliant(due to time) I think it's a very interesting tool as Object Orientation makes it easier for a project to scale and in a more organized way.
4. docker: I believe using docker and a good CI tool(like jenkins or travis-ci) makes it way less painful when deploying projects to productions. Using for example, kubernetes or even Docker Swarm can facilitate making sure all the systems and stable and accessible. I didn't use in this project but i have to say I really enjoy using Terraform as IAC which not only makes it easy to deploy stuff on the cloud but most important will document every change that happens in the infrastructure side.
5. Apidoc: It's a simple way to document an api, but once more I've chosen it because it quite easy to implement and I didn't have a lot of time. I personally prefer using swagger which gives you not only the documentation but also easy ways to test api calls.

## To do

- JSON Schemas(validations), 
- Unit tests(Very important), 
- proper login system(using perhaps Oauth2, JWT or at least bare tokens), 
- a lot of ifs don't make me happy, I wish I had time to use more design patterns like decorators(to for example add the payment processors of a transaction), strategies and so on.
- perhaps if there are a lot of microservices and some data analytics might be considered, we could use UUID through and Ids in all databases of the archictecture.
- Sure thing there is a bunch of other things I will remember as soon as I commit xD...

## Example on Adding data to API and checking Collective Listing Transactions

- Create 3 users(you might use curl, postman or plug anything to connect to the REST API)
    - `curl -H "Content-Type: application/json" -X POST --data '{"email": "user1@gmail.com", "name":"user1", "password":"user1test123"}' http://localhost:3000/users`
    - `curl -H "Content-Type: application/json" -X POST --data '{"email": "user2@gmail.com", "name":"user2", "password":"user2test123"}' http://localhost:3000/users`
    - `curl -H "Content-Type: application/json" -X POST --data '{"email": "user3@gmail.com", "name":"user23", "password":"user3test123"}' http://localhost:3000/users`
    - User 1 -> {"email": "user1@gmail.com", "name":"user1", "password":"user1test123"}
    - User 2 -> {"email": "user2@gmail.com", "name":"user2", "password":"user2test123"}
    - User 3 -> {"email": "user3@gmail.com", "name":"user23", "password":"user3test123"}

- Finding users and its ids:
	- you can `GET /users` or `GET /users/:id` through the browser or curl to get the user id 
  	- `curl http://localhost:3000/users`

- Create Collective through User 1
    - `curl -H "Content-Type: application/json" -X POST --data '{"description": "description of collective", "title":"title of collective"}' http://localhost:3000/users/5b3213a7e900c94e659fd77b/collectives`
    - This command will create a collective

- Get the created collective(as there is only one you can use the 'GET /collectives')
    - `curl http://localhost:3000/collectives`
    - This will return an collective without transactions and contributors(users that send money to collective) and with current Balance 0

```json
{
    "currentBalance": 0,
    "_id": "5b327df8ef829c0020d2a0ef",
    "description": "description of collective",
    "title": "title of collective",
    "creator": {
        "_id": "5b327c63ef829c0020d2a0ec",
        "email": "user1@gmail.com",
        "name": "user1",
        "password": "$2b$10$bO8BLXLCodIKn0L054Ew6uufeuJzDFA7simTxWPwon4ev06Tg9oaK",
        "__v": 0
    },
    "contributors": [],
    "transactions": [],
    "__v": 0
}
```
- User 2 send U$2000 to transaction 
	- When the user 2 sends 2000 to the contract:
		- `curl -H "Content-Type: application/json" -X POST --data '{"value": 2000}' http://localhost:3000/users/5b327c63ef829c0020d2a0ed/collectives/5b327df8ef829c0020d2a0ef`
	  	- the currentBalance becomes 2000 
	  	- this user is added to the contributors of the project
      	- one `collectiveTransaction` with value of 2000 is added
      	-  3 `feecollectiveTransactions` are generated(opencollective, fiscalSponsor and stripe)
      	- opencollective gets 5%(`value: 100`), fiscalSponsor gets 5%(`value: 100`), stripe gets 2.9% + $0.30(`value: 58.30`)
      - data: 

```json
  {
    "currentBalance": 2000,
    "_id": "5b3283376b173c00205377ca",
    "description": "description of collective",
    "title": "title of collective",
    "creator": {
        "_id": "5b3283126b173c00205377c7",
        "email": "user1@gmail.com",
        "name": "user1",
        "password": "$2b$10$pJGwnSsamNDPu0Iklw7g/.bjmeV9paEf1A7WpknuBcpv4.BVGpkLm",
        "__v": 0
    },
    "contributors": [
        {
            "_id": "5b3283126b173c00205377c8",
            "email": "user2@gmail.com",
            "name": "user2",
            "password": "$2b$10$Sd1ktwwM7nP/Q34qD5sodOerrdGGVnsoxZiI5Xy2gu04V2Acvn4lO",
            "__v": 0
        }
    ],
    "transactions": [
        {
            "feeCollectiveTransactions": [
                {
                    "_id": "5b32836d6b173c00205377d0",
                    "collectiveTransactionId": "5b32836d6b173c00205377cf",
                    "paymentProcessor": {
                        "_id": "5b3282e56b173c00205377c3",
                        "collectivePays": false,
                        "name": "openCollective",
                        "txPercent": 0.05,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 100,
                    "__v": 0
                },
                {
                    "_id": "5b32836d6b173c00205377d2",
                    "collectiveTransactionId": "5b32836d6b173c00205377cf",
                    "paymentProcessor": {
                        "_id": "5b3282e56b173c00205377c4",
                        "collectivePays": false,
                        "name": "fiscalSponsor",
                        "txPercent": 0.05,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 100,
                    "__v": 0
                },
                {
                    "_id": "5b32836d6b173c00205377d4",
                    "collectiveTransactionId": "5b32836d6b173c00205377cf",
                    "paymentProcessor": {
                        "_id": "5b3282e56b173c00205377c5",
                        "collectivePays": false,
                        "name": "stripe",
                        "txFixValue": 0.3,
                        "txPercent": 0.029,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 58.3,
                    "__v": 0
                }
            ],
            "_id": "5b32836d6b173c00205377cf",
            "collectiveId": "5b3283376b173c00205377ca",
            "userId": "5b3283126b173c00205377c8",
            "value": 2000,
            "__v": 0
        }
    ],
    "__v": 0
}
```
  
6. Collective sends 500 to user 1
	- When the collective sends 500 to the contract:
		0. `curl -H "Content-Type: application/json" -X POST --data '{"value": 2000}' http://localhost:3000/collectives/5b327df8ef829c0020d2a0ef/users/5b3283126b173c00205377c7`
		1. the currentBalance becomes 2000-500 = 1500
		2. one `collectiveTransaction` with value of -500 is added(money out of collective is represented with negative value)
		3.  1 `feecollectiveTransactions` is generated(paypal)
		5. paypal gets 2.9% + $0.30(`value: 14.80`)
		6. data:
		
```json
{
    "currentBalance": 1500,
    "_id": "5b3287e76e8e160020c43f2d",
    "description": "description of collective",
    "title": "title of collective",
    "creator": {
        "_id": "5b3287d66e8e160020c43f2a",
        "email": "user1@gmail.com",
        "name": "user1",
        "password": "$2b$10$djbNAV6IOTD5gjX0vXJ1ru.EbVLg270lPsNs/3XmPUPIajoyrr..W",
        "__v": 0
    },
    "contributors": [
        {
            "_id": "5b3287d66e8e160020c43f2b",
            "email": "user2@gmail.com",
            "name": "user2",
            "password": "$2b$10$l4A8smYjsXR0px5jI.FFa.sdDbiJ.8muXFu0kojBPRB8X9lSknVFu",
            "__v": 0
        }
    ],
    "transactions": [
        {
            "feeCollectiveTransactions": [
                {
                    "_id": "5b3288226e8e160020c43f32",
                    "collectiveTransactionId": "5b3288226e8e160020c43f31",
                    "paymentProcessor": {
                        "_id": "5b3287c66e8e160020c43f26",
                        "collectivePays": false,
                        "name": "openCollective",
                        "txPercent": 0.05,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 100,
                    "__v": 0
                },
                {
                    "_id": "5b3288226e8e160020c43f34",
                    "collectiveTransactionId": "5b3288226e8e160020c43f31",
                    "paymentProcessor": {
                        "_id": "5b3287c66e8e160020c43f27",
                        "collectivePays": false,
                        "name": "fiscalSponsor",
                        "txPercent": 0.05,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 100,
                    "__v": 0
                },
                {
                    "_id": "5b3288226e8e160020c43f36",
                    "collectiveTransactionId": "5b3288226e8e160020c43f31",
                    "paymentProcessor": {
                        "_id": "5b3287c66e8e160020c43f28",
                        "collectivePays": false,
                        "name": "stripe",
                        "txFixValue": 0.3,
                        "txPercent": 0.029,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 58.3,
                    "__v": 0
                }
            ],
            "_id": "5b3288226e8e160020c43f31",
            "collectiveId": "5b3287e76e8e160020c43f2d",
            "userId": "5b3287d66e8e160020c43f2b",
            "value": 2000,
            "__v": 0
        },
        {
            "feeCollectiveTransactions": [
                {
                    "_id": "5b32886e6e8e160020c43f58",
                    "collectiveTransactionId": "5b32886e6e8e160020c43f57",
                    "paymentProcessor": {
                        "_id": "5b3287c66e8e160020c43f29",
                        "collectivePays": true,
                        "name": "payPal",
                        "txFixValue": 0.3,
                        "txPercent": 0.029,
                        "userPays": false,
                        "__v": 0
                    },
                    "value": -14.8,
                    "__v": 0
                }
            ],
            "_id": "5b32886e6e8e160020c43f57",
            "collectiveId": "5b3287e76e8e160020c43f2d",
            "userId": "5b3287d66e8e160020c43f2a",
            "value": -500,
            "__v": 0
        }
    ],
    "__v": 0
}

```


## Database Structure

I have built the database structure in a way you can always get the "Nested" data from the `collectives`. So if you have one collective and then someone does one transaction to this collective, you will be able to see the transaction through the field `collective.transactions`, this will show an array of all the transactions present in the collective. Also Each  Collective Transaction generates Extra Transactions so we can keep track of the `fees` this "main transaction" is imposed. For example:

- User 1 sends U$100 to Collective 1, We generate 1 `collective transaction`(model `CollectiveTransaction`) and also Fee transactions associated this "main transaction").
- These fee transaction are generate through the collection `PaymentProcessor` that basically stores `Paypal`, `Opencollective`, `Stripe` and `FiscalSponsor` and it's payments rules.
- For each `PaymentProcessor` that charges Fees when a user sends money to a Collective, we would generate a called `FeeCollectiveTransaction` that will be associated to the main one. This way we keep track of all transactions of the collective and always know, for example, how much Stripe is getting from the whole transaction or even from the whole collective.
- If a Collective sends money to a user, it means it decreased its balance, so we add a transaction from the collective to the user with a negative balance inside the collective history as the money went out.

Example of data output when using endpoint `GET collectives/:id` :

```json
{
    "currentBalance": 3800,
    "_id": "5b325feebc9ee100207cad2c",
    "description": "description of collective",
    "title": "title of collective",
    "creator": {
        "_id": "5b325fbcbc9ee100207cad2b",
        "email": "user2@gmail.com",
        "name": "user2",
        "password": "$2b$10$DlE3FQ2YuwM1TNrcXWjxWezN9rY4gfVyUyndja64Jugf.qd1iJsmq",
        "__v": 0
    },
    "contributors": [
        {
            "_id": "5b325fbcbc9ee100207cad2b",
            "email": "user2@gmail.com",
            "name": "user2",
            "password": "$2b$10$DlE3FQ2YuwM1TNrcXWjxWezN9rY4gfVyUyndja64Jugf.qd1iJsmq",
            "__v": 0
        },
        {
            "_id": "5b325fbcbc9ee100207cad2b",
            "email": "user2@gmail.com",
            "name": "user2",
            "password": "$2b$10$DlE3FQ2YuwM1TNrcXWjxWezN9rY4gfVyUyndja64Jugf.qd1iJsmq",
            "__v": 0
        },
        {
            "_id": "5b325fbcbc9ee100207cad2b",
            "email": "user2@gmail.com",
            "name": "user2",
            "password": "$2b$10$DlE3FQ2YuwM1TNrcXWjxWezN9rY4gfVyUyndja64Jugf.qd1iJsmq",
            "__v": 0
        }
    ],
    "transactions": [
        {
            "feeCollectiveTransactions": [
                {
                    "_id": "5b326051bc9ee100207cad33",
                    "collectiveTransactionId": "5b326051bc9ee100207cad32",
                    "paymentProcessor": {
                        "_id": "5b325ecebc9ee100207cad25",
                        "collectivePays": false,
                        "name": "openCollective",
                        "txPercent": 0.05,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 100,
                    "__v": 0
                },
                {
                    "_id": "5b326051bc9ee100207cad35",
                    "collectiveTransactionId": "5b326051bc9ee100207cad32",
                    "paymentProcessor": {
                        "_id": "5b325ecebc9ee100207cad26",
                        "collectivePays": false,
                        "name": "fiscalSponsor",
                        "txPercent": 0.05,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 100,
                    "__v": 0
                },
                {
                    "_id": "5b326051bc9ee100207cad37",
                    "collectiveTransactionId": "5b326051bc9ee100207cad32",
                    "paymentProcessor": {
                        "_id": "5b325ecebc9ee100207cad27",
                        "collectivePays": false,
                        "name": "stripe",
                        "txFixValue": 0.3,
                        "txPercent": 0.029,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 58.3,
                    "__v": 0
                }
            ],
            "_id": "5b326051bc9ee100207cad32",
            "collectiveId": "5b325feebc9ee100207cad2c",
            "userId": "5b325fb3bc9ee100207cad29",
            "value": 2000,
            "__v": 0
        },
        {
            "feeCollectiveTransactions": [
                {
                    "_id": "5b326053bc9ee100207cad55",
                    "collectiveTransactionId": "5b326053bc9ee100207cad54",
                    "paymentProcessor": {
                        "_id": "5b325ecebc9ee100207cad25",
                        "collectivePays": false,
                        "name": "openCollective",
                        "txPercent": 0.05,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 100,
                    "__v": 0
                },
                {
                    "_id": "5b326053bc9ee100207cad57",
                    "collectiveTransactionId": "5b326053bc9ee100207cad54",
                    "paymentProcessor": {
                        "_id": "5b325ecebc9ee100207cad26",
                        "collectivePays": false,
                        "name": "fiscalSponsor",
                        "txPercent": 0.05,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 100,
                    "__v": 0
                },
                {
                    "_id": "5b326053bc9ee100207cad59",
                    "collectiveTransactionId": "5b326053bc9ee100207cad54",
                    "paymentProcessor": {
                        "_id": "5b325ecebc9ee100207cad27",
                        "collectivePays": false,
                        "name": "stripe",
                        "txFixValue": 0.3,
                        "txPercent": 0.029,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 58.3,
                    "__v": 0
                }
            ],
            "_id": "5b326053bc9ee100207cad54",
            "collectiveId": "5b325feebc9ee100207cad2c",
            "userId": "5b325fb3bc9ee100207cad29",
            "value": 2000,
            "__v": 0
        },
        {
            "feeCollectiveTransactions": [
                {
                    "_id": "5b326058bc9ee100207cad82",
                    "collectiveTransactionId": "5b326058bc9ee100207cad81",
                    "paymentProcessor": {
                        "_id": "5b325ecebc9ee100207cad25",
                        "collectivePays": false,
                        "name": "openCollective",
                        "txPercent": 0.05,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 100,
                    "__v": 0
                },
                {
                    "_id": "5b326058bc9ee100207cad84",
                    "collectiveTransactionId": "5b326058bc9ee100207cad81",
                    "paymentProcessor": {
                        "_id": "5b325ecebc9ee100207cad26",
                        "collectivePays": false,
                        "name": "fiscalSponsor",
                        "txPercent": 0.05,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 100,
                    "__v": 0
                },
                {
                    "_id": "5b326058bc9ee100207cad86",
                    "collectiveTransactionId": "5b326058bc9ee100207cad81",
                    "paymentProcessor": {
                        "_id": "5b325ecebc9ee100207cad27",
                        "collectivePays": false,
                        "name": "stripe",
                        "txFixValue": 0.3,
                        "txPercent": 0.029,
                        "userPays": true,
                        "__v": 0
                    },
                    "value": 58.3,
                    "__v": 0
                }
            ],
            "_id": "5b326058bc9ee100207cad81",
            "collectiveId": "5b325feebc9ee100207cad2c",
            "userId": "5b325fb3bc9ee100207cad29",
            "value": 2000,
            "__v": 0
        },
        {
            "feeCollectiveTransactions": [
                {
                    "_id": "5b3261a5bc9ee100207cadc4",
                    "collectiveTransactionId": "5b3261a5bc9ee100207cadc3",
                    "paymentProcessor": {
                        "_id": "5b325ecfbc9ee100207cad28",
                        "collectivePays": true,
                        "name": "payPal",
                        "txFixValue": 0.3,
                        "txPercent": 0.029,
                        "userPays": false,
                        "__v": 0
                    },
                    "value": -57.7,
                    "__v": 0
                }
            ],
            "_id": "5b3261a5bc9ee100207cadc3",
            "collectiveId": "5b325feebc9ee100207cad2c",
            "userId": "5b325fb3bc9ee100207cad29",
            "value": -2000,
            "__v": 0
        },
        {
            "feeCollectiveTransactions": [
                {
                    "_id": "5b3261b9bc9ee100207cadfe",
                    "collectiveTransactionId": "5b3261b9bc9ee100207cadfd",
                    "paymentProcessor": {
                        "_id": "5b325ecfbc9ee100207cad28",
                        "collectivePays": true,
                        "name": "payPal",
                        "txFixValue": 0.3,
                        "txPercent": 0.029,
                        "userPays": false,
                        "__v": 0
                    },
                    "value": -5.500000000000001,
                    "__v": 0
                }
            ],
            "_id": "5b3261b9bc9ee100207cadfd",
            "collectiveId": "5b325feebc9ee100207cad2c",
            "userId": "5b325fb3bc9ee100207cad29",
            "value": -200,
            "__v": 0
        }
    ],
    "__v": 0
}

```

User 1 send 

### Users

Regular users of the system(contributors/creators): 

```
{
  name : { type: String, required: true, unique: true },
  email : { type: String, required: true, unique: true },
  password : { type: String, required: true },
}
```

In this example we can see that for each Transaction of the Collective we have an array of the so called `FeeCollectiveTransaction` model.

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
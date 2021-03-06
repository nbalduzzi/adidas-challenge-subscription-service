<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1024px-Adidas_Logo.svg.png" width="320" alt="Nest Logo" /></a>
</p>

## Description

Adidas Challenge Subscription Service API

## Tech Stack

**NodeJS version:** v12.12.0

**Framework:** [NestJS](https://nestjs.com/)

**Documentation**: [Swagger](https://swagger.io/)

**Persistence - DB:** [MongoDB](https://www.mongodb.com/)

## Considerations

1. This service persist the data on `MongoDB` and use the [`mongoose`](https://mongoosejs.com/) library for connect with nodejs.

2. This service has a `docker-compose.yml` file where use a mongodb image from `docker-registry` for challenge purpose. With this composer you will be able to up the service and the db instances at once.

3. All the `mongodb` configuration parameters are in the `.env` file

4. I choose `delete` the record from mongo on `cancel subscription`. Other way can be update the record with status `CANCELED` depends on product.

5. I choose `paginate` the `get all subscriptions` with a simple page number pagination strategy. Other way is using an `infinity scroll pagination` strategy where pass as query string parameter the last evaluation key (last item on the results) to get the new data. We can discuse later ;)

6. I desided not implementing a `Queue producer` from any technology like `RabbitMQ` or `Redis` to dont adding complex layers on the project, but is a better solution than the http async call from subscriptor service for sending the email, is a better aproach implement a `queue producer`.

7. The `.env.production` file is in the repository and the information inside is the same as `.env.development` for challenge purpose, but this must not be like this. The production enviroment variables must be in some `vpc` or some secured storage and encrypted, and must be injected (or replaced) on deploy step.
The `SECRET` inside must be different of `development env`, the `EMAIL_SERVICE_URL` should point to the production url and the `MONGODB` variables must be all different as `development env` and that mongo must be in a sharded cluster for distribute across multiple machines.

## Security

### Authorization Header

The security of this api is `Bearer Auth JWT Authorization`

To use de API directly, the `JWT` need to be generated with the below payload for success authorization:

```json
{
  {
    "origin": "adidas-challenge-public-service",
    "resource": "subscriptions",
    "timestamp": 1617895752000
  }
}
```

> The api is not validating the origin and resource by role, you can put any origin or resource, it is the same for the api. **All the fields are mandatory**.

The `timestamp` to use must be in milliseconds and can be *at least* 2 min before the current timestamp in milliseconds. This aproach was to avoid retries or force brute attacks.

The algorithm used was `HS256` and the secret for hashing the jwt is in `.env` file

#### Help utils

* Can use the [jwt.io](https://jwt.io/) page to generate a valid token

* Can use the [epoch converter](https://www.epochconverter.com/) page to get the current timestamp in ms.

### Helmet and Cors

1. `Cors` was enabled for challenge purpose. Is not fully configurated for special origins.

2. `Helmet` used for helping setting various HTTP headers for security reasons.

### Validation Input Data

Validation pipe added for validate controllers DTO's structure.

## Requirements

1. [NodeJS](https://nodejs.org/es/download/) installed

2. [NVM](https://github.com/nvm-sh/nvm) installed

## Installation

```bash
# Set the node version on .nvmrc file
$ nvm use

# Install dependencies
$ npm install
```

## Running the app

```bash
# development
$ npm run start # run on port 3002

# watch mode
$ npm run start:dev # run on port 3002

# production mode
$ npm run start:prod # run on port 3002
```

> Healt Check enpoint on `http://localhost:3001/ping`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

> **Note:** Only run e2e test on `/ping` (health check) endpoint

## Docker

```bash
# Docker build image
$ docker build . -t adidas-challenge-subscription-service

# Docker run image
$ docker run -p3002:3002 adidas-challenge-subscription-service
```

### Docker Compose

```bash
# Up containers
$ docker-compose up

# Clean and up containers
$ docker-compose up --build --force-recreate
```

## Documentation

Swagger documentation only on dev instance: `http:localhost:3001/api`

## CI/CD Proposal

This pipeline executes on push to any branch

| Step Name | Description | Trigger | Tasks |
|---|---|---|---|
| Build | Build image | `Automatic` *(On `branch push`)* | Build Docker image |
| Test | Testing and security | `Automatic` *(On `build step success`)* | `Parallel` | On `Build` step |
|---|---|---| `npm audit dependecies` |
|---|---|---| `unit test` |
|---|---|---| `integration test` |
| Deploy `Dev` | Deploy builded image to `Dev` environment | `Automatic` *(On `test step success`)* | Execute command to deploy to `development` environment |
| Test `e2e` | Check Overall API endpoints on `dev` | `Manual` *(On `deploy dev` step success)* | Execute `e2e` tests |
| Deploy `Staging` | Deploy builded image to `Staging` environment | `Manual` *(On `deploy dev` step success)* | `Replace` or `inject` the `env values` and execute command to deploy to `staging` environment |
| Deploy `Production` | Deploy builded image to `Production` environment | `Manual` *(On `deploy dev` step success)* | `Replace` or `inject` the `env values` and execute command to deploy to `production` environment |

## Kubernetes

The `kubernetes` configuration is in `k8s` folder inside the project.

As a Backend Developer, only create the `yml` files for: `secrets`, `config maps` and `deployment`.

## License

[MIT licensed](LICENSE).

# IdeaNestJs

## Description

IdeaNestJs is built using the [Nest](https://github.com/nestjs/nest) framework, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. This project is mainly written in TypeScript and provides a robust API service focusing on managing ideas and authentication.

## Project Structure

- **src/**: Contains the main source code for the NestJS application.
- **test/**: Contains unit and end-to-end tests.
- **dist/**: Output directory for the compiled project.

## Technology Stack

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeScript**: A superset of JavaScript that compiles to clean JavaScript output.
- **Serverless Framework**: Used for deploying the application to AWS Lambda.

## Installation

To install the necessary dependencies, run:

```bash
$ npm install

## Running the App

You can run the application in various modes:

### Development

```bash
$ npm run start:dev

### Production

```bash
$ npm run start:prod


## Deployment

The application can be deployed to AWS Lambda using the Serverless Framework. The following commands are available for deployment:

### Development/Staging Deployment

```bash
$ npm run sls

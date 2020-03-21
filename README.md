# COVID-selfreport-api

Built using ExpressJS.

To run API server locally, you will need a Mongo database server instance up and running.

Configure environment variables

```
NODE_ENV="development"
WEB_API_PORT=9192

MONGO_URI="mongodb://user:password@localhost:27017/covid_db1"
MONGO_DB_NAME="covid_db1"
```

Install dependencies

```
npm install
```

Run development server

```
npm run start:dev
```

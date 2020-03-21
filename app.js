import co from 'co';
import express from 'express';
import fs from 'fs';
import path from 'path';
import './mongo';
import cfg from './cfg';
import ErrorHandler from './lib/reqHandlers/errorHandler';
import NotFoundHandler from './lib/reqHandlers/notFoundHandler';
import OnResponseLogger from './lib/reqHandlers/onResponseLogger';
import cors from './lib/reqHandlers/enableCors';
import p3p from './lib/reqHandlers/enableP3P';
import PatientsRoutes from './routes/patients';
import Logger from './logger';

const bodyParser = require('body-parser');

const app = express();
app.set('trust proxy', 1);

app.use(OnResponseLogger);
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(cors);
app.use(p3p);

// Status check
app.use('/status', (req, res) => {
  res.jsonp({
    success: true,
    status: 'Running',
  });
});

// Setting up routes
app.use('/patients', PatientsRoutes);

app.get('/robots.txt', (req, res) => {
  res.status(200);
  res.set({
    'content-type': 'text/plain; charset=utf-8',
  });
  return res.send('User-agent: *\r\nDisallow: /');
});

app.use('/', express.static(path.join(__dirname, 'app', 'dist')));

// TODO index.html needs to be written in Error Handler, Fix
//app.use((err, req, res, next) => {
//  if (err) {
//    return next(err);
//  }
//
//  try {
//    fs.createReadStream(path.join(__dirname, 'app', 'dist', 'index.html')).pipe(res);
//  } catch (err) {
//    return next(err);
//  }
//});

app.use(ErrorHandler);
app.use(NotFoundHandler);

Logger.info('Initialized ExpressJS application');
export default app;

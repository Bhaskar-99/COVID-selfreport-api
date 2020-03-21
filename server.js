require('@babel/register');

import http from 'http';
import app from './app';
import cfg from './cfg';
import Logger from './logger';

// Start server
const server = http.createServer(app);
server.setTimeout(20 * 60 * 1000); // 20 minutes
server.listen(cfg.port, () => {
  Logger.info('Express server is up and running on port', cfg.port);
});

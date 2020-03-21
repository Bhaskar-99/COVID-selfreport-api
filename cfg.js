/*
 global process
 */

/* eslint-disable import/no-dynamic-require */

import path from 'path';
import * as pkg from './package.json';

const env = process.env.NODE_ENV || 'development';
const port = process.env.WEB_API_PORT || 9192;

const cfg = {
  activity_update_time: 3 * 60, // 3 minutes

  app_name: pkg.name,

  app_title: 'COVID-2019 Self Reporting API',

  cache: {
    enabled: (env !== 'development'),
  },

  env,

  formats: {
    in: {
      date: 'YYYY-MM-DD',
      time: 'HH:mm:ss',
      datetime: 'YYYY-MM-DD HH:mm:ss',
    },

    out: {
      date: 'YYYY-MM-DD',
      time: 'HH:mm:ss',
      datetime: 'YYYY-MM-DD HH:mm:ss',
    },
  },

  mongo: {
    uri: process.env.MONGO_URI,
    reconnect_time: 2 * 1000,
  },

  paging: {
    defaultLimit: 10,
    maxLimit: 800,
  },

  passphrase: process.env.VERIFICATION_PASSPHRASE,

  paths: {
    base: path.join(__dirname, '/..'),
    logs: path.join(__dirname, '/../logs'),
    views: path.join(__dirname, '/../views'),
    separator: '/',
  },

  // Which port will this application run on
  port,

  redis: {
    cachetime: 30 * 24 * 60 * 60, // 30 days
    cachetime_global: 2 * 24 * 60 * 60, // 2 days

    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : null,
  },

  // path where temporary uploaded files are stored
  uploads: {
    allowed_file_types: ['csv'],
    allowed_collateral_types: ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'],
    allowed_image_types: ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif'],
    max_size: 10 * 1024 * 1024,  // 10 MB
    tmp_path: path.join(__dirname, '/../uploads/tmp/'),
  },
};

export default cfg;

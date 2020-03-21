import express from 'express';
import { isNil, isNaN } from 'lodash';
import co from 'co';
import ReportsLib from '../lib/reports';
import cfg from '../cfg';
import Logger from '../logger';

const router = express.Router();

router.get('/', (req, res, next) => {
  let { lat, lng, radius, page, limit } = req.query;

  try {
    lat = parseFloat(lat);
  } catch (err) {
    lat = null;
  }

  if (isNil(lat) || isNaN(lat)) {
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'Invalid lat',
    });
  }

  try {
    lng = parseFloat(lng);
  } catch (err) {
    lng = null;
  }

  if (isNil(lng) || isNaN(lng)) {
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'Invalid lng',
    });
  }

  try {
    radius = parseFloat(radius);
  } catch (err) {
    radius = null;
  }

  if (isNil(radius) || isNaN(radius)) {
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'Invalid radius',
    });
  }

  if (!page) {
    page = 1;
  } else {
    try {
      page = parseInt(page);

      if (page < 1) {
        page = 1;
      }
    } catch (err) {
      page = 1;
    }
  }

  if (!limit) {
    limit = cfg.paging.defaultLimit;
  } else {
    try {
      limit = parseInt(limit);

      if (limit > cfg.paging.maxLimit) {
        limit = cfg.paging.maxLimit;
      }
    } catch (err) {
      limit = cfg.paging.defaultLimit;
    }
  }

  co(function*() {
    const result = yield ReportsLib.findWithinGeoLocation(lat, lng, radius, page, limit);

    // TODO Decide output format

    return res.jsonp({
      success: true,
      reports: result.docs,
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
      offset: result.offset,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to get reports data';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

router.get('/:reportId', (req, res, next) => {
  const { reportId } = req.params;

  if (!reportId) {
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'Invalid report Id',
    });
  }

  co(function*() {
    const report = yield ReportsLib.findById(reportId);
    if (!report) {
      res.status(400);
      return res.jsonp({
        success: false,
        error: 'Invalid report Id',
      });
    }

    return res.jsonp({
      success: true,
      report,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to get report data';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

router.use((req, res, next) => {
  res.jsonp({
    success: false,
    error: 'Still WIP',
  });
});

router.post('/', (req, res, next) => {
  const reportData = req.body;

  let { name } = reportData;

  if (!name) {
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'report name is required.',
    });
  }

  co(function*() {
    const report = yield ReportsLib.createNew(reportData);

    res.jsonp({
      success: true,
      report,
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      err.status = 400;
      err.customMsg = values(err.errors).join(', ');
      return next(err);
    }

    err.status = 500;
    Logger.error('Failed to create new report', req.body, err);
    err.customMsg = 'Failed to create new report';
    return next(err);
  });
});

router.patch('/:reportId', (req, res, next) => {
  const { reportId } = req.params;
  const acceptedFields = [
    'loc', 'locationId', 'city', 'district', 'state', 'country', 'pinCode', 'isSelf', 'fullName',
    'phoneNumber', 'alternatePhoneNumber', 'preferredLanguage', 'symptoms',
    'travelToHighRiskCountry', 'traveledToCountry', 'contactWithPatient', 'contactPatientInfo',
    'chronicIllness', 'notes', 'isSuspected', 'isOtpVerified', 'isVerified',
  ];

  co(function*() {
    const report = yield ReportsLib.findById(reportId);
    let fieldCount = 0;

    for (const field in req.body) {
      if (req.body.hasOwnProperty(field)) {
        if (acceptedFields.includes(field) && report.get(field) !== req.body[field]) {
          report.set(field, req.body[field]);
          fieldCount++;
        }
      }
    }

    if (!fieldCount) {
      res.status(200);
      return res.jsonp({
        success: true,
        updated: false,
        report,
      });
    }

    report.set('updatedAt', new Date());

    report.updatedAt = new Date();
    yield report.save();

    res.jsonp({
      success: true,
      updated: true,
      report,
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      err.status = 400;
      err.customMsg = values(err.errors).join(', ');
      return next(err);
    }

    err.status = 500;
    Logger.error('Failed to update report data', { reportId, ...req.body }, err);
    err.customMsg = 'Failed to update report data';
    return next(err);
  });
});

export default router;

import express from 'express';
import { isNil, isNaN } from 'lodash';
import co from 'co';
import PatientsLib from '../lib/patients';
import cfg from '../cfg';
import Logger from '../logger';

const router = express.Router();

router.get('/', (req, res, next) => {
  let { lat, lng, radius, page, limit, status } = req.query;

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

  if (!status) {
    status = 'confirmed';
  }

  co(function*() {
    const result = yield PatientsLib.findWithinGeoLocation(lat, lng, radius, status, page, limit);

    // TODO Decide output format

    return res.jsonp({
      success: true,
      patients: result.docs,
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
      offset: result.offset,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to get patients data';
    Logger.error(err.customMsg, err);
    return next(err);
  });
});

router.get('/:patientId', (req, res, next) => {
  const { patientId } = req.params;

  if (!patientId) {
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'Invalid Patient Id',
    });
  }

  co(function*() {
    const patient = yield PatientsLib.findById(patientId);
    if (!patient) {
      res.status(400);
      return res.jsonp({
        success: false,
        error: 'Invalid Patient Id',
      });
    }

    return res.jsonp({
      success: true,
      patient,
    });
  }).catch((err) => {
    err.status = 500;
    err.customMsg = 'Failed to get patient data';
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
  const patientData = req.body;

  let { name } = patientData;

  if (!name) {
    res.status(400);
    return res.jsonp({
      success: false,
      error: 'Patient name is required.',
    });
  }

  co(function*() {
    const patient = yield PatientsLib.createNew(patientData);

    res.jsonp({
      success: true,
      patient,
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      err.status = 400;
      err.customMsg = values(err.errors).join(', ');
      return next(err);
    }

    err.status = 500;
    Logger.error('Failed to create new patient', req.body, err);
    err.customMsg = 'Failed to create new patient';
    return next(err);
  });
});

router.patch('/:patientId', (req, res, next) => {
  const { patientId } = req.params;
  const acceptedFields = [
    'name', 'statePatientNumber', 'age', 'gender', 'loc', 'locationId', 'address',
    'symptoms', 'status', 'contractedFrom', 'reportedAt', 'announcedAt', 'confirmedAt',
    'hospitalizedDt', 'recoveredAt', 'deceasedAt', 'migratedAt',
    'lastStatusUpdateDt', 'reportedBy', 'notes', 'isVerified', 'sources', 'remarks', 'isActive',
  ];

  co(function*() {
    const patient = yield PatientsLib.findById(patientId);
    let fieldCount = 0;

    for (const field in req.body) {
      if (req.body.hasOwnProperty(field)) {
        if (acceptedFields.includes(field) && patient.get(field) !== req.body[field]) {
          patient.set(field, req.body[field]);
          fieldCount++;
        }
      }
    }

    if (!fieldCount) {
      res.status(200);
      return res.jsonp({
        success: true,
        updated: false,
        patient,
      });
    }

    patient.set('updatedAt', new Date());

    patient.updatedAt = new Date();
    yield patient.save();

    res.jsonp({
      success: true,
      updated: true,
      patient,
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      err.status = 400;
      err.customMsg = values(err.errors).join(', ');
      return next(err);
    }

    err.status = 500;
    Logger.error('Failed to update patient data', { patientId, ...req.body }, err);
    err.customMsg = 'Failed to update patient data';
    return next(err);
  });
});

export default router;

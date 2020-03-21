import mongoose from 'mongoose';
import { merge } from 'lodash';
import Patient from './models/Patient';

const PatientsLib = {};

PatientsLib.findById = (_id) => {
  return Patient.findOne({
    _id,
  });
};

PatientsLib.findWithinGeoLocation = (lat, lng, radius, status, page, limit) => {
  const statuses = [];

  if (status === 'confirmed') {
    statuses.push('confirmed');
    statuses.push('hospitalized');
    statuses.push('deceased');
    statuses.push('migrated');
    statuses.push('recovered');
  } else {
    statuses.push(status);
  }

  return Patient.paginate({
    loc: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        $maxDistance: radius * 1000,
        $minDistance: 0
      },
    },
    isActive: true,
    isVerified: true,
    status: {
      $in: statuses,
    },
  }, {
    page,
    limit,
    sort: {
      updatedAt: -1,
    },
  });
};

PatientsLib.createNew = (patientData) => {
  const patient = new Patient();
  patient._id = new mongoose.Types.ObjectId;
  merge(patient, patientData);
  return patient.save();
};

export default PatientsLib;

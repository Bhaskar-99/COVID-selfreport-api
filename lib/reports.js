import mongoose from 'mongoose';
import { merge } from 'lodash';
import Report from './models/Report';

const ReportsLib = {};

ReportsLib.findById = (_id) => {
  return Report.findOne({
    _id,
  });
};

ReportsLib.findWithinGeoLocation = (lat, lng, radius, page, limit) => {
  return Report.paginate({
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
    isOtpVerified: true,
    isVerified: true,
  }, {
    page,
    limit,
    sort: {
      updatedAt: -1,
    },
  });
};

ReportsLib.createNew = (reportData) => {
  const report = new Report();
  report._id = new mongoose.Types.ObjectId;
  merge(report, reportData);
  return report.save();
};

export default ReportsLib;

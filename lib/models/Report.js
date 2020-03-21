import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { myMongoDatabase } from '../../mongo';
import pointSchema from './Point';

let Schema = mongoose.Schema;
let reportModel;
let reportSchema;

reportSchema = new Schema({
  _id: Schema.Types.ObjectId,

  loc: {
    type: pointSchema,
    required: false,
  },

  locationId: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    default: null,
  },

  city: {
    type: String,
    default: '',
  },

  district: {
    type: String,
    default: '',
  },

  state: {
    type: String,
    default: '',
  },

  country: {
    type: String,
    default: '',
  },

  pinCode: {
    type: Number,
    default: 0,
  },

  isSelf: {
    type: Boolean,
    default: true,
  },

  fullName: {
    type: String,
    default: '',
  },

  phoneNumber: {
    type: String,
    default: '',
  },

  alternatePhoneNumber: {
    type: String,
    default: '',
  },

  preferredLanguage: {
    type: String,
    default: '',
  },

  symptoms: {
    type: Object,
    default: {
      'Fever': false,
      'Cough': false,
      'Shortness of Breath': false
    },
  },

  travelToHighRiskCountry: {
    type: Boolean,
    default: false,
  },

  traveledToCountry: {
    type: String,
    default: '',
  },

  contactWithPatient: {
    type: Boolean,
    default: false,
  },

  contactPatientInfo: {
    type: String,
    default: '',
  },

  chronicIllness: {
    type: String,
    default: '',
  },

  notes: {
    type: String,
    default: '',
  },

  isSuspected: {
    type: Boolean,
    default: false,
  },

  isOtpVerified: {
    type: Boolean,
    default: false,
  },

  isVerified: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },
}, { strict: false, collection: 'reports' });

reportSchema.index({ loc: '2dsphere' });

reportSchema.plugin(mongoosePaginate);

reportModel = myMongoDatabase.model('Report', reportSchema);
export default reportModel;

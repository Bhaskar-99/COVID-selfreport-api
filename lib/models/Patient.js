import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { myMongoDatabase } from '../../mongo';
import pointSchema from './Point';

let Schema = mongoose.Schema;
let patientModel;
let patientSchema;

patientSchema = new Schema({
  _id: Schema.Types.ObjectId,

  name: {
    type: String,
    default: '',
  },

  statePatientNumber: {
    type: String,
    default: '',
  },

  age: {
    type: Number,
    default: 0,
  },

  gender: {
    type: String,
    default: '',
  },

  loc: {
    type: pointSchema,
    required: false,
  },

  locationId: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    default: null,
  },

  address: {
    type: String,
    default: '',
  },

  symptoms: {
    type: Object,
    default: {},
  },

  status: {
    type: String,
    enum: ['reported', 'suspected', 'confirmed', 'hospitalized', 'deceased', 'recovered', 'migrated', 'none'],
    default: 'none',
  },

  contractedFrom: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    default: null,
  },

  reportedAt: {
    type: Date,
    default: null,
  },

  announcedAt: {
    type: Date,
    default: null,
  },

  confirmedAt: {
    type: Date,
    default: null,
  },

  hospitalizedDt: {
    type: Date,
    default: null,
  },

  recoveredAt: {
    type: Date,
    default: null,
  },

  deceasedAt: {
    type: Date,
    default: null,
  },

  migratedAt: {
    type: Date,
    default: null,
  },

  lastStatusUpdateDt: {
    type: Date,
    default: null,
  },

  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  notes: {
    type: String,
    default: '',
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  sources: {
    type: Array,
    default: [],
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  remarks: {
    type: String,
    default: ''
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },
}, { strict: false, collection: 'patients' });

patientSchema.index({ loc: '2dsphere' });

patientSchema.plugin(mongoosePaginate);

patientModel = myMongoDatabase.model('Patient', patientSchema);
export default patientModel;

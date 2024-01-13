import { model, Schema, Types } from "mongoose";
import Role from "./Role";
import User from "./User";

export const DOCUMENT_NAME = "Patient";
export const COLLECTION_NAME = "patients";

export default interface Patient {
  _id: Types.ObjectId;
  id?: string;
  patient_id?: string;

  name?: string;
  profilePicUrl?: string;
  email?: string;
  birthday?: Date;
  gender?: string;
  image?: string;
  url?: string;

  start_date?: Date;
  status?: string;
  notes?: string;
  treatment_option?: string;

  // bac si theo doi
  followedByDoctor?: string;

  // nha khoa tham kham
  clinic_at?: string;

  createdBy?: User;
  updatedBy?: User;

  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Patient>(
  {
    patient_id: {
      type: Schema.Types.String,
      unique: true,
      required: true,
      trim: true,
      maxlength: 150,
    },
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      sparse: true, // allows null
      trim: true,
      // select: false,
    },
    birthday: {
      type: Schema.Types.Date,
      required: true,
    },
    treatment_option: {
      type: Schema.Types.String,
      default: "",
    },

    followedByDoctor: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },

    clinic_at: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },

    status: {
      type: Schema.Types.String,
      default: "",
    },
    start_date: {
      type: Schema.Types.Date,
      required: true,
    },
    notes: {
      type: Schema.Types.String,
      default: "",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
    },

    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

schema.index({ _id: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ status: 1 });

export const PatientModel = model<Patient>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);

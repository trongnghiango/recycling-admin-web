import { model, Schema, Types } from "mongoose";
import User from "./User";

export const DOCUMENT_NAME = "Doctor";
export const COLLECTION_NAME = "doctors";

export default interface Doctor {
  _id: Types.ObjectId;
  id?: string;
  doctor_id?: string;

  name?: string;
  profilePicUrl?: string;
  email?: string;
  phone?: string;
  birthday?: Date;
  gender?: string;
  image?: string;
  url?: string;

  // specil doctor field
  //...

  clinicCode: string;
  createdBy?: User;
  updatedBy?: User;

  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Doctor>(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    doctor_id: {
      type: Schema.Types.String,
      unique: true,
      required: true,
      trim: true,
      maxlength: 150,
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
    phone: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
    birthday: {
      type: Schema.Types.Date,
    },

    clinicCode: {
      type: Schema.Types.String,
      trim: true,
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

export const DoctorModel = model<Doctor>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);

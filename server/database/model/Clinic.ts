import { model, Schema, Types } from "mongoose";
import Doctor from "./Doctor";
import User from "./User";

export const DOCUMENT_NAME = "Clinic";
export const COLLECTION_NAME = "clinics";

export default interface Clinic {
  _id: Types.ObjectId;
  clinicCode?: string;
  name?: string;
  address?: string,
  hotline?: string,
  email?: string,
  description?: string;
  image?: string;
  url?: string;

  // specil clinic field
  doctors?: Doctor[];

  createdBy?: User;
  updatedBy?: User;

  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Clinic>(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    clinicCode: {
      type: Schema.Types.String,
      trim: true,
      unique: true,
      maxlength: 25,
    },
    address: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
    hotline: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
    email: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
    description: {
      type: Schema.Types.String,
      trim: true,
    },
    doctors: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Doctor",
        },
      ],
      required: true,
      select: false,
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
    status: {
      type: Schema.Types.Boolean,
      default: true,
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
schema.index({ code: 1, status: 1 });

export const ClinicModel = model<Clinic>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);

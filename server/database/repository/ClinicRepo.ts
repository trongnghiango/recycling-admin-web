import Clinic, { ClinicModel } from "../model/Clinic";
import { Types } from "mongoose";

async function findAll(): Promise<Clinic[] | null> {
  return ClinicModel.find({ status: true }).lean().exec();
}

async function findById(id: Types.ObjectId): Promise<Clinic | null> {
  return ClinicModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(clinic: Clinic): Promise<Clinic> {
  const now = new Date();
  clinic.createdAt = now;
  clinic.updatedAt = now;
  const created = await ClinicModel.create(clinic);
  return created.toObject();
}

async function update(clinic: Clinic): Promise<Clinic | null> {
  clinic.updatedAt = new Date();
  return ClinicModel.findByIdAndUpdate(clinic._id, clinic, { new: true })
    .lean()
    .exec();
}

async function findClinicById(id: Types.ObjectId): Promise<Clinic | null> {
  return ClinicModel.findOne({ _id: id, status: true }).lean().exec();
}

export default {
  findAll,
  findById,
  create,
  update,
  findClinicById,
};

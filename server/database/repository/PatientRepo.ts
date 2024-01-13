import Patient, { PatientModel } from "../model/Patient";
import { Types } from "mongoose";

async function findById(id: Types.ObjectId): Promise<Patient | null> {
  return PatientModel.findOne({ _id: id }).lean().exec();
}

async function findAll(): Promise<Patient[]> {
  return PatientModel.find({}).lean().exec();
}

async function create(patient: Patient): Promise<Patient> {
  const now = new Date();
  patient.createdAt = now;
  patient.updatedAt = now;
  const created = await PatientModel.create(patient);
  return created.toObject();
}

async function update(patient: Patient): Promise<Patient | null> {
  patient.updatedAt = new Date();
  return PatientModel.findByIdAndUpdate(patient._id, patient, { new: true })
    .lean()
    .exec();
}

export default {
  findById,
  findAll,
  create,
  update,
};

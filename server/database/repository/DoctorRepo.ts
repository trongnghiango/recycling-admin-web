import Doctor, { DoctorModel } from "../model/Doctor";
import { Types } from "mongoose";

async function findAll(): Promise<Doctor[] | null> {
  return DoctorModel.find({}).lean().exec();
}

async function findDoctorsByClinic(clinic: {
  clinicCode: string;
}): Promise<Doctor[] | null> {
  return DoctorModel.find(clinic).lean().exec();
}

async function findById(id: Types.ObjectId): Promise<Doctor | null> {
  return DoctorModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(doctor: Doctor): Promise<Doctor> {
  const now = new Date();
  doctor.createdAt = now;
  doctor.updatedAt = now;
  const created = await DoctorModel.create(doctor);
  return created.toObject();
}

async function update(doctor: Doctor): Promise<Doctor | null> {
  doctor.updatedAt = new Date();
  return DoctorModel.findByIdAndUpdate(doctor._id, doctor, { new: true })
    .lean()
    .exec();
}

export default {
  findById,
  create,
  update,
  findAll,
  findDoctorsByClinic,
};

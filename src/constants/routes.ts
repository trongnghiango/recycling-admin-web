export enum RoutesDynamicKey {
  PatientId = "[patient_id]",
  FilmId = "[film_id]",
  // ThreedId = '[threed_id]'
}

export enum Routes {
  Index = "/",
  Player = "/player",
  Upload = "/upload",
  ThreeDViewer = "/threedviewer",
  About = "/about",
  Films = "/films",
  Films_FilmId = "/films/[film_id]",
  Patients = "/patients",
  Patients_PatientId = "/patients/[patient_id]",
  Doctors = "/doctors",
  Doctors_DoctorId = "/Doctors/[doctor_id]",
}

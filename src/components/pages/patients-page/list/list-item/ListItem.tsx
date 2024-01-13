import React from "react";
import Link from "next/link";
import { IPatient } from "../../../../../domains/patients/patients.constants";
import { Routes, RoutesDynamicKey } from "constants/routes";

interface IProps {
  patient: IPatient;
}

export const ListItem: React.FC<IProps> = (props) => {
  return (
    <Link
      href={Routes.Patients_PatientId.replace(
        RoutesDynamicKey.PatientId,
        props.patient.patient_id ?? ""
      )}
    >
      <a>
        {props.patient.description}: {props.patient.title}
      </a>
    </Link>
  );
};

ListItem.displayName = "ListItem";

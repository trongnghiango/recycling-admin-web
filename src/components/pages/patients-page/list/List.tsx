import React from "react";
import { ListItem } from "./list-item/ListItem";
import { IPatient } from "domains/patients/patients.constants";

interface IProps {
  patients: IPatient[];
}

export const List: React.FC<IProps> = (props) => {
  return (
    <ul>
      {props.patients.map((patient) => (
        <li key={patient.patient_id}>
          <ListItem patient={patient} />
        </li>
      ))}
    </ul>
  );
};

List.displayName = "List";

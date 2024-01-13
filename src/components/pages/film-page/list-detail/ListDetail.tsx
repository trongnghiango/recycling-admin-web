import React from "react";

interface IProps {
  patient: any;
}

export const ListDetail: React.FC<IProps> = (props) => {
  return (
    <div>
      <h1>Title {props.patient.name}</h1>
      <p>ID: {props.patient.description}</p>
    </div>
  );
};

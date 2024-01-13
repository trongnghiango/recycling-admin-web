import { type } from "os";
import React from "react";
import { IFilm } from "../../../domains/films/films.constants";
import { ListDetail } from "./list-detail/ListDetail";

type IPatient = any;

interface IProps {
  patient?: IPatient;
  errors?: string;
}

export const FilmPage: React.FC<IProps> = (props) => {
  if (props.errors) {
    return (
      <p>
        <span style={{ color: "red" }}>Error:</span> {props.errors}
      </p>
    );
  }

  return <>{props.patient && <ListDetail patient={props.patient} />}</>;
};

FilmPage.displayName = "FilmPage";

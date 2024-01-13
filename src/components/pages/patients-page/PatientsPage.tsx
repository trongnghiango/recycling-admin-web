import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { List } from "./list/List";
import { Routes, RoutesDynamicKey } from "constants/routes";
import { IPatient } from "domains/patients/patients.constants";
import { encryptId } from "utils/aesUtil";
import moment from "moment";
import EditText from "components/ui/EditText/EditText";
import FormPatientCreator from "./list/FormPatientCreator";
import { BButton } from "components/shared/button/BButton";
import styles from "./patient.module.scss";
import ExpandView from "components/ui/expand-view/ExpandView";
import ShowViewAnimation from "components/ui/ShowViewAnimation";
import { useRouter } from "next/router";

interface IProps {
  patients: IPatient[];
  clinics: any[];
  softReload?: any;
}

const PatientsPages = (props: IProps) => {
  const { clinics, patients } = props;
  const [isDisplayedFormCreator, setShow] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  const reload = () => {
    props.softReload();
    setIsMounted(false);
  };

  return (
    <div>
      {/* <h2>Patients List</h2> */}

      <div className={`container mx-auto flex-col flex mt-4 mb-8`}>
        {/* <Link
          href={{
            pathname: Routes.Patients_PatientId.replace(RoutesDynamicKey.PatientId, 'add-new-patient'),

          }}
          passHref
        >
          <a className="bg-[#009ace] py-[15px] pl-[12px] pr-[45px] text-white cursor-pointer hover:scale-105 transition-all">
            <span className="text-[17.5px] font-bold ">tient</span>
          </a>
        </Link> */}

        <div className="relative">
          <button
            onClick={() => setIsMounted(!isMounted)}
            className={`absolute z-20 bg-[#dcdddf] text-2xl font-bold py-2 px-2 ${
              isMounted ? " translate-x-6 transition-all" : ""
            }`}
          >
            Add new patient
          </button>
        </div>
        <div
          className={`translate-y-6 mx-4 pt-8 ${
            isMounted ? "border " : "border-none"
          } border-zinc-600`}
        >
          <ShowViewAnimation isMounted={isMounted}>
            <FormPatientCreator
              clinics={clinics}
              onFailure={() => {
                console.log("onFailure");
              }}
              onSuccess={reload}
            />
          </ShowViewAnimation>
        </div>
      </div>
      <>
        <PatientsList patients={patients} />
      </>
    </div>
  );
};

PatientsPages.displayName = "PatientsPages";
export default PatientsPages;

const PatientsList: React.FC<any> = ({ patients }) => {
  return (
    <div className="container mx-auto">
      <table
        className={`
      //table-users 
      shadow`}
      >
        <thead>
          <tr>
            <th>Patient</th>
            <th>Start Date</th>
            <th>Treatment option</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(patients) &&
            patients.map((item, idx) => (
              <Link
                key={item._id}
                href={{
                  pathname: Routes.Patients_PatientId.replace(
                    RoutesDynamicKey.PatientId,
                    item.patient_id ?? "view"
                  ),
                  query: {
                    patient: JSON.stringify(item),
                    p: encryptId(item.patient_id!).toString(),
                  },
                }}
                passHref
              >
                <tr
                  key={`${item._id}-${idx}`}
                  className="h-full cursor-pointer hover:bg-blue-100"
                  onClick={() => console.log("click")}
                >
                  <>
                    <td>
                      <div className="flex items-center gap-x-3">
                        <div className="relative h-[50px] w-[50px] flex-shrink-0 object-contain">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={"avt"}
                              layout={"fill"}
                            />
                          )}
                        </div>
                        <p className="w-full flex flex-col items-center gap-2">
                          <span className="text-lg">{item.name}</span>
                          <span>{`(# ${item._id})`}</span>
                        </p>
                      </div>
                    </td>
                    <td>{moment(item.start_date).format("YYYY-MM-DD")}</td>
                    <td>{item.treatment_option}</td>
                    <td>{item.status}</td>
                    <td>
                      <p className="flex flex-col items-start">
                        <span>{item.notes}</span>
                        <span>{item.email}</span>
                      </p>
                    </td>
                  </>
                </tr>
              </Link>
            ))}
        </tbody>
      </table>
    </div>
  );
};

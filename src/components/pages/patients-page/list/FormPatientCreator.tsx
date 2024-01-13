import { OutlineButton } from "components/pages/patient-page/AddNewPatient";
import { BButton } from "components/shared/button/BButton";
import EditText from "components/ui/EditText/EditText";
import { getDoctorsByClinic } from "domains/doctors/doctors.services";
import { addPatient, getPatients } from "domains/patients/patients.services";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { SET_LOADING } from "state/ActionTypes";
import { useStateValue } from "state/AppProvider";

interface IPatientCreatorProps {
  clinics: any[];
  onSuccess: () => void;
  onFailure: () => void;
}

export default function FormPatientCreator({
  clinics,
  onSuccess,
  onFailure,
}: IPatientCreatorProps) {
  const { state, dispatch } = useStateValue();
  const [doctors, setDoctors] = useState([]);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      patient_id: "",
      name: "",
      email: "",
      birthday: "",
      followedByDoctor: "default",
      clinic_at: "default",
      status: "OPENNED",
      start_date: "",
      treatment_option: "",
      notes: "",
    },
  });
  const setLoading = (value: boolean) => {
    dispatch({
      type: SET_LOADING,
      payload: { loading: value },
    });
  };

  async function onSubmit(dat: any) {
    setLoading(true);
    const { data } = await addPatient(dat);
    if (!!data) {
      onSuccess();
    } else {
      onFailure();
    }
    setLoading(false);
  }

  /*
    "name": "Ngo Gia Thinh Phong",
      "patient_id": "thinhbd",
      "email": "giathinh@email.com",
      "birthday": "2000-05-14T07:06:05.123Z",
      "treatment_option": "Comprehensive Package",
      "status": "PEDDING",
      "start_date": "2023-02-04T00:00:00.000Z",
      "notes": "GV"
  */

  const selectClinicHandler = async (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    console.log("Call api get doctors from clinicCode::", e.target.value);
    const { data } = await getDoctorsByClinic(e.target.value);
    setDoctors(data);
    console.log({ data });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-4 desktop:mx-auto max-w-[1100px] flex flex-col mb-6"
    >
      <div className="flex flex-col tablet:flex-row gap-2 tablet:gap-8 px-4">
        <div className="flex-1">
          {/* Field name */}
          <div className="mobile:w-full">
            <EditText placeholder="Patient name" {...register("name")} />
          </div>
          {/* id */}
          <div className="mobile:max-w-[250px] w-full">
            <EditText placeholder="Patient ID" {...register("patient_id")} />
          </div>
          {/* email */}
          <div className="">
            <EditText placeholder="Email" {...register("email")} />
          </div>

          {/* birthday */}
          <div className="mobile:max-w-[250px] w-full">
            <EditText placeholder="Birthday" {...register("birthday")} />
          </div>

          {/* clinic at */}
          <div className="w-full">
            <div
              className={`relative flex items-center mt-4 mb-2 w-full min-w-[150px]`}
            >
              <select
                {...register("clinic_at")}
                className="pt-[12px] pb-[10px] w-full h-full leading-none tracking-wide px-4 text-[16px] text-zinc-800 bg-zinc-200 border-zinc-500 border rounded-md border-opacity-50 outline-none focus:border-zinc-800 hover:border-zinc-800 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                onChange={selectClinicHandler}
              >
                <option value="default">-- select clinic --</option>
                {Array.isArray(clinics) &&
                  clinics.map((clinic, idx) => (
                    <option
                      key={idx}
                      value={clinic.clinicCode}
                      className="pt-[12px] pb-[10px] w-full h-full leading-none tracking-wide px-4 text-[16px] text-zinc-800 bg-zinc-200 border-zinc-500 border rounded-md border-opacity-50 outline-none focus:border-zinc-800 hover:border-zinc-800 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                    >
                      {clinic.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* doctor */}
            <div className="w-full">
              <div
                className={`relative flex items-center mt-4 mb-2 w-full min-w-[150px]`}
              >
                <select
                  {...register("followedByDoctor")}
                  className="pt-[12px] pb-[10px] w-full h-full leading-none tracking-wide px-4 text-[16px] text-zinc-800 bg-zinc-200 border-zinc-500 border rounded-md border-opacity-50 outline-none focus:border-zinc-800 hover:border-zinc-800 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                  onChange={(e) => {
                    console.log("bs::", e.target.value);
                  }}
                >
                  <option value="default">-- select doctor --</option>
                  {Array.isArray(doctors) &&
                    doctors.map(({ _id, name }, idx) => (
                      <option
                        key={idx}
                        value={_id}
                        className="pt-[12px] pb-[10px] w-full h-full leading-none tracking-wide px-4 text-[16px] text-zinc-800 bg-zinc-200 border-zinc-500 border rounded-md border-opacity-50 outline-none focus:border-zinc-800 hover:border-zinc-800 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                      >
                        {name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <EditText
            placeholder="Treatment Option"
            {...register("treatment_option")}
          />
          {/* <EditText placeholder='Status' {...register("status")} /> */}
          <EditText placeholder="Notes" {...register("notes")} />
          <EditText placeholder="Start Date" {...register("start_date")} />
        </div>
      </div>
      {/* <div className="w-[250px]">
        <EditText placeholder="Doctor" {...register("followedByDoctor")} />
      </div> */}
      <div className="flex items-center justify-between">
        <OutlineButton label="Cancel" />
        <BButton className={"w-[150px] my-4"} label={"Submit"} />
      </div>

      {/*
      "treatment_option": "Comprehensive Package",
      "status": "PEDDING",
      "start_date": "2023-02-04T00:00:00.000Z",
      "notes": "GV"
      */}
    </form>
  );
}

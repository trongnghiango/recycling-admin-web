import { BButton } from "@/components/shared/button/BButton";
import ShowViewAnimation from "@/components/ui/ShowViewAnimation";
import { updateClinic } from "@/domains/clinics/clinics.services";
import { IReloadPageProps } from "@/pages/clinics";
import { SET_LOADING } from "@/state/ActionTypes";
import { useStateValue } from "@/state/AppProvider";
import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { EditText, IClinicEditor } from "./ClinicPage";

interface IProps {
  clinic: IClinicEditor;
  onSuccess: () => void;
  onFailure: () => void;
}

export default function FormClinicEditor({
  clinic,
  onSuccess,
  onFailure,
}: IProps) {
  const { state, dispatch } = useStateValue();
  // const [clinic, setClinic] = useState();
  const { _id, name, description } = clinic;
  const { register, handleSubmit } = useForm({
    defaultValues: {
      clinicCode: _id || "",
      name: name || "",
      description: description || "",
      notes: "",
    },
  });
  const setLoading = (value: boolean) => {
    dispatch({
      type: SET_LOADING,
      payload: { loading: value },
    });
  };

  // const onError = (errors, e) => console.log(errors, e);

  async function onSubmit(dat: any, e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { name, description } = dat;
    const { data } = await updateClinic(dat.clinicCode, { name, description });
    console.log({ data });
    if (!!data) {
      onSuccess();
    } else {
      onFailure();
    }
    setLoading(false);
  }

  return (
    <div className="mx-4 desktop:mx-auto max-w-[1100px] flex flex-col mb-6">
      <div className={`container mx-auto flex-col flex mt-4 mb-8`}>
        <div className="relative">
          <button
            className={`absolute z-20 bg-[#dcdddf] hover:scale-105 transition-all text-2xl font-bold py-2 px-2 ${
              true ? " translate-x-6 transition-all" : ""
            }`}
          >
            Modify Clinic
          </button>
        </div>
        <div
          className={`translate-y-6 mx-4 mb-2 pt-6 ${
            true ? "border " : "border-none"
          } border-zinc-600`}
        >
          <ShowViewAnimation isMounted={true}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              // className="px-6 py-4 flex flex-col space-y-4 shadow-lg"
              className="px-16 py-4 flex flex-col gap-6 shadow-lg divide-y divide-gray-400"
            >
              <EditText placeholder="Name" {...register("name")} />
              <EditText
                placeholder="Code"
                className="w-1/3"
                disabled
                {...register("clinicCode")}
              />
              <EditText
                {...register("description")}
                placeholder="Description"
              />
              <div className="flex items-center justify-between">
                <button
                  className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                  data-bs-dismiss="modal"
                  onClick={() => {}}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                  onClick={onFailure}
                >
                  Close
                </button>
              </div>
            </form>
          </ShowViewAnimation>
        </div>
      </div>
    </div>
  );
}

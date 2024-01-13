import ShowViewAnimation from "@/components/ui/ShowViewAnimation";
import { BButton } from "components/shared/button/BButton";
import { addClinic, getClinics } from "domains/clinics/clinics.services";
import useLongPress from "hooks/useLongPress";
import React, { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiClinic, BiEdit, BiRecycle, BiRedo, BiUndo } from "react-icons/bi";
import PopupModel from "components/ui/popup-modal/PopupModal";
import Link from "next/link";
import Image from "next/image";
import FormClinicEditor from "./FormClinicEditor";
import { IReloadPageProps } from "@/pages/clinics";
import { encryptId } from "@/utils/aesUtil";

interface IProps extends IReloadPageProps {
  clinics?: any;
}

export interface IClinicEditor {
  _id: string;
  name: string;
  description: string;
}
export default function ClinicPage({ clinics, softReload }: IProps) {
  const [edit, editSet] = useState<IClinicEditor | undefined>();
  // const [clinics, setClinics] = useState([]);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      clinicCode: "",
      name: "",
      address: "",
      hotline: "",
      email: "",
      description: "",
    },
  });
  const {
    action: otherAction,
    handlers: otherHandlers,
    onActionCancel,
  } = useLongPress();
  const [isMounted, setIsMounted] = useState(false);

  const reload = () => {
    if (!!softReload) {
      console.log("msg:: softReload");
      softReload();
    }
    setIsMounted(false);
  };
  const addNewClinicHandler = () => {
    console.log("Tess::jk");
  };
  async function onSubmit(data: any) {
    const res = await addClinic(data);

    if (!!res && !!res.data) {
      onActionCancel();
      reload();
    }
  }

  const editClinicHandler = (
    e: FormEvent,
    { _id, clinicCode, name, description }: any
  ) => {
    e.preventDefault();
    editSet({
      _id,
      name,
      description,
    });
  };

  const showHang = otherAction === "longpress";

  return (
    <div className={`relative`}>
      <div className="container mx-auto">
        <div className={`container mx-auto flex-col flex mt-4 mb-8`}>
          <div className="relative">
            <button
              onClick={() => setIsMounted(!isMounted)}
              className={`absolute z-20 bg-[#dcdddf] hover:scale-105 transition-all text-2xl font-bold py-2 px-2 ${
                isMounted ? " translate-x-6 transition-all" : ""
              }`}
            >
              Add new Clinic
            </button>
          </div>
          <div
            className={`translate-y-6 mx-4 mb-2 pt-6 ${
              isMounted ? "border " : "border-none"
            } border-zinc-600`}
          >
            <ShowViewAnimation isMounted={isMounted}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="px-16 py-4 flex flex-col gap-6 shadow-lg divide-y divide-gray-800"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2 tablet:flex-row tablet:gap-8">
                    <EditText
                      className="w-full"
                      placeholder="Name"
                      {...register("name")}
                    />
                    <EditText
                      placeholder="Clinic Code"
                      className="mobile:w-2/5"
                      {...register("clinicCode")}
                    />
                  </div>
                  <div className="flex flex-col gap-2 tablet:flex-row tablet:gap-8">
                    <EditText
                      className="w-full"
                      placeholder="Email"
                      {...register("email")}
                    />
                    <EditText
                      placeholder="Hotline"
                      className="mobile:w-2/5"
                      {...register("hotline")}
                    />
                  </div>
                  <EditText {...register("address")} placeholder="Address" />
                  <EditText
                    {...register("description")}
                    placeholder="Description"
                  />
                </div>
                <div className="flex flex-col pt-6">
                  <BButton className={"w-[150px]"} label={"Submit"} />
                </div>
              </form>
            </ShowViewAnimation>
          </div>
        </div>

        <div className="clinic-table relative">
          <table className="table-auto">
            <thead>
              <tr>
                {showHang && <th>Editor</th>}
                <th>Name</th>
                <th>Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {!!clinics &&
                clinics.length > 0 &&
                clinics.map(
                  (
                    { _id, clinicCode, name, description }: any,
                    index: number
                  ) => (
                    <tr
                      key={index}
                      {...otherHandlers}
                      className="hover:bg-blue-100 hover:opacity-70 cursor-pointer"
                    >
                      {showHang && (
                        <td className="flex items-center space-x-2">
                          <button
                            className="h-[25px] w-[25px] text-red-600 hover:scale-110 transition-all"
                            onClick={onActionCancel}
                          >
                            <BiRecycle className="w-full h-full" />
                          </button>
                          <button
                            onClick={(e) =>
                              editClinicHandler(e, {
                                _id,
                                clinicCode,
                                name,
                                description,
                              })
                            }
                            className="h-[25px] w-[25px] text-green-600 hover:scale-105"
                          >
                            <BiEdit className="w-full h-full" />
                          </button>
                          {/* upload logo button */}
                          <Link
                            href={{
                              pathname: "/upload",
                              query: { p: encryptId(clinicCode) },
                            }}
                            passHref
                          >
                            <a className="h-[25px] w-[25px] text-blue-600 hover:scale-110 transition-all">
                              <BiRecycle className="w-full h-full" />
                            </a>
                          </Link>
                        </td>
                      )}
                      <td>{name}</td>
                      <td>{clinicCode}</td>
                      <td>{description}</td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
          {showHang && (
            <button
              onClick={onActionCancel}
              className="absolute top-0 right-0 p-1 hover:shadow-lg hover:scale-105 cursor-pointer translate-x-1/2 -translate-y-1/2 border shadow rounded-full"
            >
              <div className="h-8 w-8">
                <BiUndo className="h-full w-full" />
              </div>
            </button>
          )}
        </div>
      </div>
      <PopupModel
        show={!!edit ? true : false}
        // setCancel={() => {}}
      >
        <div className="modal-dialog modal-dialog-centered relative w-auto mx-auto pointer-events-none">
          <div className="modal-content border-none z-50 shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-body relative p-4 text-gray-700 flex flex-col items-center justify-center">
              {!!edit && (
                <FormClinicEditor
                  clinic={edit}
                  onSuccess={() => softReload()}
                  onFailure={() => editSet(undefined)}
                />
              )}
            </div>
          </div>
        </div>
      </PopupModel>
    </div>
  );
}

interface TextFieldProps extends React.HTMLAttributes<HTMLInputElement> {
  placeholder: string;
  disabled?: boolean;
  name: string;
}

export const EditText = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props: TextFieldProps, ref) => {
    const { name, placeholder, disabled } = props;
    return (
      <div
        className="input-group relative flex flex-col items-stretch w-full"
        {...props}
      >
        <span className={`capitalize text-[1.2rem] font-medium`}>
          {placeholder}
        </span>
        <input
          ref={ref}
          name={name}
          disabled={disabled}
          type="text"
          className="form-control relative flex-auto min-w-0 block w-full mt-1 mb-2 px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-[#d8d8d8] transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#464646] focus:outline-none hover:shadow"
          placeholder={placeholder}
          aria-label="S"
          aria-describedby="button-addon2"
        />
      </div>
    );
  }
);

EditText.displayName = "EditText";

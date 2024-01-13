import ShowViewAnimation from "@/components/ui/ShowViewAnimation";
import { IReloadPageProps } from "@/pages/doctors";
import { BButton } from "components/shared/button/BButton";
import { addDoctor, getDoctors } from "domains/doctors/doctors.services";
import useLongPress from "hooks/useLongPress";
import React, { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiEdit } from "react-icons/bi";
import { OutlineButton } from "../patient-page/AddNewPatient";

const a = {
  doctor_id: "CQ2403",
  name: "BAc si BD qua doa",
  email: "bc@vkkl.com",
  clinicCode: "PK003593",
  birthday: "2012-05-14T07:06:05.123Z",
};

interface IDoctorPageProps extends IReloadPageProps {
  doctors: any[];
  clinics: any[];
}

export default function DoctorPage(props: IDoctorPageProps) {
  const { clinics, doctors, softReload } = props;
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      doctor_id: "",
      name: "",
      email: "",
      birthday: "",
      phone: "",
      clinicCode: "default",
    },
  });
  const [isMounted, setIsMounted] = useState(false);

  const reload = () => {
    if (!!softReload) softReload();
    setIsMounted(false);
  };
  // const { action: otherAction, handlers: otherHandlers } = useLongPress()
  const addNewDoctorHandler = () => {
    console.log("Tess::jk");
  };
  async function onSubmit(data: any) {
    console.log({ data });
    const res = await addDoctor(data);

    if (!res || !res.data || typeof res["data"] !== "object") {
      console.log(res);
      alert(
        `ERROR:: Lỗi trong việc tạo thông tin Bác sĩ. Vui lòng thử lại hoặc liên hệ ban quản trị.`
      );
      return;
    }

    reload();

    alert(`qian:: ${JSON.stringify(res.data, null, 2)}`);
    // const r = await getDoctors();
    // setDoctors(r.data);
  }

  useEffect(() => {
    (async function () {
      // const res = await getDoctors();
      // setDoctors(res.data);
      // console.log('TEO:::', res)
    })();
  }, []);
  const resetFormHandler = (e: FormEvent) => {
    e.preventDefault();
    reset((formValues) => ({
      ...formValues,
      doctor_id: "",
      name: "",
      email: "",
      birthday: "",
      phone: "",
      clinicCode: "default",
    }));
    alert("Reset...");
  };

  const selectClinicHandler = (e: FormEvent) => {
    e.preventDefault();
  };

  // const showHang = otherAction === 'longpress' || otherAction !== ''
  return (
    <>
      <div className="container mx-auto">
        <div className={`container mx-auto flex-col flex mt-4 mb-8`}>
          <div className="relative">
            <button
              onClick={() => setIsMounted(!isMounted)}
              className={`absolute z-20 bg-[#dcdddf] hover:scale-105 transition-all text-2xl font-bold py-2 px-2 ${
                isMounted ? " translate-x-6 transition-all" : ""
              }`}
            >
              Add New Doctor
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
                className="px-16 py-4 flex flex-col gap-6 shadow-lg divide-y divide-gray-400"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4 tablet:flex-row tablet:gap-8">
                    <div className="flex-1">
                      <EditText
                        // className="max-w-full"
                        placeholder="Name"
                        {...register("name")}
                      />
                    </div>
                    <div className="flex-1">
                      <EditText
                        className="mobile:max-w-[250px] w-full"
                        placeholder="Doctor Code"
                        {...register("doctor_id")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 tablet:flex-row tablet:gap-8">
                    <div className="flex-1">
                      <EditText
                        className="max-w-full"
                        placeholder="email"
                        {...register("email")}
                      />
                    </div>
                    <div className="flex-1">
                      <EditText
                        className="mobile:max-w-[250px]"
                        {...register("birthday")}
                        placeholder="Birthday"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 tablet:flex-row tablet:gap-8">
                    <div className="flex-1">
                      <div className="input-group relative flex flex-col w-full h-full">
                        <span
                          className={`capitalize text-[1.2rem] font-medium`}
                        >
                          {`Clinic Code`}
                        </span>
                        <select
                          {...register("clinicCode")}
                          className="form-control relative flex-auto min-w-0 block w-full px-4 py-2 text-[16px] leading-8 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-[#d8d8d8] transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#464646] focus:outline-none hover:shadow"
                          onChange={selectClinicHandler}
                        >
                          <option value="default" className="text-gray-400">
                            -- select clinic --
                          </option>
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
                    </div>

                    <div className="flex-1">
                      <EditText
                        className="mobile:max-w-[250px]"
                        {...register("phone")}
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between py-6">
                  <BButton className={"w-[150px]"} label={"Submit"} />
                  <OutlineButton
                    className={"w-[150px]"}
                    label={"Reset"}
                    onClick={resetFormHandler}
                  />
                </div>
              </form>
            </ShowViewAnimation>
          </div>
        </div>

        <table className="table-auto">
          <thead>
            <tr>
              {
                // showHang && <th>Editor</th>
              }
              <th>Name</th>
              <th>Code</th>
              <th>Email</th>
              <th>Clinic</th>
            </tr>
          </thead>
          <tbody>
            {!!doctors &&
              doctors.length > 0 &&
              doctors.map(
                (
                  { doctor_id, name, email, clinicCode }: any,
                  index: number
                ) => (
                  <tr
                    key={index}
                    // {...otherHandlers}
                    className="hover:bg-blue-100 hover:opacity-70 cursor-pointer"
                  >
                    {/* {
                  showHang && <td className="flex items-center space-x-2">
                    <button>DDEL</button>
                    <button className="hover:scale-105"><BiEdit height={'16px'} /></button>
                  </td>
                } */}
                    <td>{name}</td>
                    <td>{doctor_id}</td>
                    <td>{email}</td>
                    <td>{clinicCode}</td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    </>
  );
}

interface TextFieldProps extends React.HTMLAttributes<HTMLInputElement> {
  placeholder: string;
  name: string;
  // className?: any;
}
function TextField(props: TextFieldProps) {
  const { name, placeholder } = props;
  return (
    <div className="input-group relative flex items-stretch w-full" {...props}>
      <input
        name={name}
        type="text"
        className="form-control relative flex-auto min-w-0 block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-[#d8d8d8] transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#464646] focus:outline-none hover:shadow"
        placeholder={placeholder}
        aria-label="S"
        aria-describedby="button-addon2"
      />
    </div>
  );
}

const EditText = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props: TextFieldProps, ref) => {
    const { name, placeholder } = props;
    return (
      <div className="input-group relative flex flex-col w-full" {...props}>
        <span className={`capitalize text-[1.2rem] font-medium`}>
          {placeholder}
        </span>
        <input
          ref={ref}
          name={name}
          type="text"
          className="form-control relative flex-auto min-w-0 block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-[#d8d8d8] transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#464646] focus:outline-none hover:shadow"
          placeholder={placeholder}
          aria-label="S"
          aria-describedby="button-addon2"
        />
      </div>
    );
  }
);
EditText.displayName = "Edit";

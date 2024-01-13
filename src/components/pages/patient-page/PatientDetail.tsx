import { IPatient } from "domains/patients/patients.constants";
import { useRef } from "react";
import { encryptId } from "utils/aesUtil";
import ComprehensivePackage from "./ComprehensivePackage";
import OrderProgress from "./OrderProgress";
import PatientInfo from "./PatientInfo";
import StepsList from "./StepsList";

export default function PatientDetail(props: IPatient) {
  const { patient_id, clinic_at, name } = props;
  // console.log("Prop::::", props);
  const scollToUpLoadViewRef = useRef<any>();

  const scrollToUploadViewHandler = (e: Event) => {
    e.preventDefault();
    if (!!scollToUpLoadViewRef && !!scollToUpLoadViewRef.current) {
      scollToUpLoadViewRef.current.scrollIntoView();
    }
  };

  return (
    <>
      {/* <h1>Detail Patient</h1> */}
      <div className="container mx-auto flex flex-col tablet:flex-row gap-4 my-8">
        {/* Noi dung chinh */}
        <div className="bg-red-200 flex-1 tablet:flex-[2_2_0%]">
          {/* Danh sach cac section cua patient */}
          <div className="flex flex-col gap-4">
            <PatientInfo {...props} onUploadView={scrollToUploadViewHandler} />

            <div ref={scollToUpLoadViewRef}>
              {!!patient_id && <StepsList enUserId={patient_id} />}
            </div>

            <OrderProgress />

            {patient_id && clinic_at && (
              <ComprehensivePackage
                patientId={patient_id}
                clinicCode={clinic_at}
                patientName={name}
              />
            )}
          </div>
        </div>

        {/* Tuy chon */}
        <div className=" flex-1 gap-1 flex flex-col">
          <OptionItem title="Supplemental order options" />
          <OptionItem title="Recent Documents" />
          <OptionItem title="Additional services" />
          <OptionItem title="Shipping labels and forms" />
        </div>
      </div>
    </>
  );
}

function OptionItem({ title }: { title?: string }) {
  return (
    <>
      <div className="flex flex-col border-[1.3px] border-black bg-white p-4 shadow md:flex-row">
        <span className="text-lg font-semibold">{title}</span>
      </div>
    </>
  );
}

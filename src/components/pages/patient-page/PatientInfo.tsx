import { decryptId } from "@/utils/aesUtil";
import { IPatient } from "domains/patients/patients.constants";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { OutlineButton } from "./AddNewPatient";

interface IProps extends IPatient {
  _id?: string;
  patient_id?: string;
  name?: string;
  avatarUrl?: string;
  birthday?: string;
  officeName?: string;
  officeAddress?: string;
  onUploadView?: (e: any) => void;
}

export default function PatientInfo(props: IProps) {
  // console.log('Props::::::', props)
  const {
    _id = "unknown",
    patient_id = "000014011377",
    name = "Nguyen Ngoc Phong",
    birthday = "unknown",
    officeName = "PhongBD",
    avatarUrl = "https://cdn.dribbble.com/users/2364329/screenshots/4759681/dribbble-11.jpg",
    officeAddress = "jsCrescent Mall, Tang B1 101 Ton Dat Tien, Tan Phu, Quan 7",
    onUploadView,
  } = props;

  const router = useRouter();

  const clickHandler = (e: Event) => {
    e.preventDefault();
    Router.push("/upload");
  };
  return (
    <>
      <div className="flex flex-col border-[1.3px] border-black bg-white p-4 shadow md:flex-row">
        {/*sec1*/}
        <div className="flex-1 p-4 text-base">
          <div className="flex flex-col mobile:flex-row gap-4">
            {/* Left Section */}
            <div className="flex-1 flex">
              <div className="flex">
                <div className="relative h-[100px] w-[70px]">
                  <Image src={avatarUrl} layout="fill" />
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <div className="flex items-center">
                    <label
                      className="text-lg font-semibold"
                      htmlFor="male"
                    ></label>
                    <span className="flex pl-[25px] text-xl font-bold text-red-800">
                      {name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-lg font-semibold" htmlFor="male">
                      Date of Birth
                    </label>
                    <span className="flex pl-[25px]">{birthday}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-lg font-semibold" htmlFor="male">
                      {" "}
                      Patient #
                    </label>
                    <span className="flex ml-5 px-4 py-2 bg-red-300">
                      {decryptId(patient_id)}{" "}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-lg font-semibold" htmlFor="male">
                      Ship to Office
                    </label>
                    <span className="flex pl-[25px]">{officeName}</span>
                  </div>
                  <div className="flex items-center">
                    <label
                      className="text-lg font-semibold"
                      htmlFor="male"
                    ></label>
                    <span className="flex pl-[25px]">{officeAddress}</span>
                  </div>
                </div>
              </div>
              {/* <input
                                type={"text"}
                                className="w-full border border-[#555] bg-transparent px-[10px] py-[5px] outline-none"
                                placeholder="Last name"
                            /> */}
            </div>
            {/* Right section */}
            <div className="flex flex-col gap-2 mobile:max-w-[150px]">
              <div className="flex mobile:flex-col justify-center items-center gap-2 flex-1">
                <OutlineButton className={"flex-1 w-full"} label="Edit" />
                <OutlineButton className={"flex-1 w-full"} label="Archive" />
              </div>
              <OutlineButton
                className={"flex-1 w-full"}
                label="Upload Final Record"
                onClick={onUploadView}
              />
            </div>
          </div>
        </div>
        {/* sec2 */}
        <div className="h-32 flex-1 p-4">
          <RowItem title="Patient Type" subtitle=" Adult" />

          <RowItem
            title="Treatment Expiration Date"
            subtitle="09/06/2026"
            description="Prior to this date, Additional Kool Aligners are included in the price. See Pricing, Terms and Conditions for Prior to this date, Additional Kool Aligners are included in the price. See Pricing, Terms and Conditions for Prior to this date, Additional Kool Aligners are included in the price. See Pricing, Terms and Conditions for Prior to this date, Additional Kool Aligners are included in the price. See Pricing, Terms and Conditions for Prior to this date, Additional Kool Aligners are included in the price. See Pricing, Terms and Conditions for details."
          />
        </div>
      </div>
    </>
  );
}

interface RowItemProps {
  title?: string;
  subtitle?: string;
  description?: string;
  onlyOneLine?: boolean;
}

function RowItem({ title, subtitle, description, onlyOneLine }: RowItemProps) {
  return (
    <>
      <div
        className={`flex ${
          !onlyOneLine && "flex-col justify-center"
        }  px-4 pb-2`}
      >
        <div className="flex">
          <h3 className="">
            {title}
            <span className="text-base ml-4 font-medium">
              <label>{subtitle}</label>
            </span>
          </h3>
        </div>

        <div
          className={`flex-1 ml-4 flex items-center ${
            onlyOneLine && "items-start"
          }`}
        >
          <p className="block text-md">{description}</p>
        </div>
      </div>
    </>
  );
}

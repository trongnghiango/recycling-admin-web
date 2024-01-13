interface IProps {
  className?: any;
  label?: string;
  onClick?: (d: any) => void;
}
export const KButton = ({ label, className }: IProps) => {
  return (
    <div className={className ?? ""}>
      <button className="h-full w-full bg-[#009ace] px-8 py-2 text-base text-white transition-all hover:scale-105">
        {label}
      </button>
    </div>
  );
};

export const OutlineButton = ({ label, className, onClick }: IProps) => {
  return (
    <div className={className ?? ""}>
      <button
        type="button"
        className="h-full w-full border border-gray-800 px-8 py-2 hover:scale-105 transition-all"
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default function AddNewPatient() {
  return (
    <div className="flex">
      <div className="container mx-auto">
        <p className="my-8 text-3xl">Add New Patient</p>
        <div>
          <div className="flex flex-col border-[1.3px] border-black bg-white p-4 shadow md:flex-row">
            {/*sec1*/}
            <div className="flex-1 p-4 text-base">
              <div className="flex flex-col">
                <h3 className="px-4 pb-2">Patient name</h3>
                <div className="mb-2 px-4">
                  <input
                    type={"text"}
                    className="w-full border border-[#555] bg-transparent px-[10px] py-[5px] outline-none"
                    placeholder="Last name"
                  />
                </div>
                <div className="mb-2 px-4">
                  <input
                    type={"text"}
                    className="w-full border border-[#555] px-[10px] py-[5px] outline-none"
                    placeholder="First name"
                  />
                </div>
                <div className="mb-2 px-4">
                  <input
                    type={"text"}
                    className="w-[130px] border border-[#555] px-[10px] py-[5px] outline-none"
                    placeholder="MI"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="px-4 pb-2">Patient gender</h3>
                <div className="item-center mb-2 flex gap-8 pl-[55px]">
                  <span>
                    <input
                      type="radio"
                      id="male"
                      name="age"
                      value="30"
                      className="mr-2"
                    />
                    <label htmlFor="male">Male</label>
                  </span>

                  <span>
                    <input
                      type="radio"
                      id="female"
                      name="age"
                      value="30"
                      className="mr-2"
                    />
                    <label htmlFor="female">Female</label>
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="px-4 pb-2">Date of birth</h3>

                <div className="mb-2 flex items-center gap-3 px-4">
                  <input
                    type={"text"}
                    className="w-16 border border-[#555] px-[10px] py-[5px] outline-none"
                    placeholder="DD"
                  />
                  <input
                    type={"text"}
                    className="w-16 border border-[#555] px-[10px] py-[5px] outline-none"
                    placeholder="MM"
                  />
                  <input
                    type={"text"}
                    className="w-[130px] border border-[#555] px-[10px] py-[5px] outline-none"
                    placeholder="YYYY"
                  />
                </div>
              </div>
            </div>
            {/* sec2 */}
            <div className="h-32 flex-1 p-4">
              <div className="flex flex-col">
                <h3 className="px-4 pb-2">Patient gender</h3>
                <div className="item-center mb-2 flex gap-8 pl-[55px]">
                  <span className="text-base">
                    <label>DR Nguyen Quoc Tuan(# 1322543), </label>
                    <label className="block" htmlFor="">
                      WestWay Dental, Crescent Mall, Tang B1, 101 Ton Dat Tien,
                      Tan Phu, Quan 7
                    </label>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 mb-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <OutlineButton label="Back" />
              <OutlineButton label="Cancel" />
            </div>
            <KButton label={"Next"} />
          </div>
        </div>
      </div>
    </div>
  );
}

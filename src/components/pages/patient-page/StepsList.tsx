import { UploadPage } from "../upload-page/UploadPage";

interface IProps {
  enUserId: string;
}

export default function StepsList({ enUserId }: IProps) {
  return (
    <>
      <div className="flex flex-col border-[1.3px] border-black bg-white p-8 shadow md:flex-row">
        <h2 className="text-2xl font-bold">Steps List</h2>
        <UploadPage p={enUserId} />
      </div>
    </>
  );
}

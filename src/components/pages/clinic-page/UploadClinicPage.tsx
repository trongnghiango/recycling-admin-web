import { useRef } from "react";
export interface IProps {
  /**
   * A string that defines the file types the file input should accept.
   * This string is a comma-separated list of unique file type specifiers.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
   */
  acceptedFileTypes?: string;
  /**
   * When allowMultipleFiles is true, the file input allows the user to select more than one file.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/multiple
   *
   * @default false
   */
  allowMultipleFiles?: boolean;
  /**
   * Text to display as the button text
   */
  label: string;
  /**
   * Handler passed from parent
   *
   * When the file input changes a FormData object will be send on the first parameter
   */
  onChange: (formData: FormData) => void;
  /**
   * The name of the file input that the backend is expecting
   */
  uploadFileName: string;
}

export default function UploadClinicPage(props: IProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const onClickHandler = () => {
    fileInputRef.current?.click();
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const formData = new FormData();
    Array.from(event.target.files).forEach((file) => {
      console.log(file);
      formData.append(
        event.target.name,
        file,
        `${props.label}.${file.name.split(".")[1]}`
      );
    });

    props.onChange(formData);

    formRef.current?.reset();
  };

  return (
    <>
      <div
        className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-500 bg-no-repeat bg-cover"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1621243804936-775306a8f2e3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)",
        }}
      >
        <div className="absolute bg-black opacity-60 inset-0 z-0" />
        <div className="mobile:max-w-[512px] w-full p-6 bg-white rounded-xl z-10">
          <div className="text-center">
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Logo Upload!
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Lorem ipsum is placeholder text.
            </p>
          </div>
          <form ref={formRef} className="mt-6 space-y-3">
            {/* <div className="grid grid-cols-1 space-y-2">
              <label className="text-sm font-bold text-gray-500 tracking-wide">
                Title
              </label>
              <input
                className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                type=""
                placeholder="mail@gmail.com"
              />
            </div> */}
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-sm font-bold text-gray-500 tracking-wide">
                Attach Document
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-[16rem] p-10 group text-center">
                  <div className="h-full w-full text-center flex flex-col justify-center items-center  ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-blue-400 group-hover:text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                      <img
                        className="has-mask h-28 object-center"
                        src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                        alt="freepik image"
                      />
                    </div>
                    <p className="pointer-none text-gray-500 ">
                      <span className="text-sm">Drag and drop</span> files here{" "}
                      <br /> or{" "}
                      <a
                        href=""
                        id=""
                        className="text-blue-600 hover:underline"
                      >
                        select a file
                      </a>{" "}
                      from your computer
                    </p>
                  </div>

                  <input
                    accept={props.acceptedFileTypes}
                    multiple={props.allowMultipleFiles}
                    name={props.uploadFileName}
                    onChange={onChangeHandler}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    type="file"
                    // directory=""
                    // webkitdirectory=""
                  />
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              <span>File type: types of images</span>
            </p>
            {/* <div>
              <button
                onClick={onClickHandler}
                className="my-3 w-full flex justify-center bg-blue-500 text-gray-100 p-3  rounded-full tracking-wide
                              font-semibold  focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
              >
                Upload
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </>
  );
}
UploadClinicPage.defaultProps = {
  acceptedFileTypes: "thePhoto",
  allowMultipleFiles: false,
};

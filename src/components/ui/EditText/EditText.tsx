import React from "react";

interface EditTextProps extends React.HTMLAttributes<HTMLInputElement> {
  label?: string;
  width?: string;
}

const EditText = React.forwardRef<HTMLInputElement, EditTextProps>(
  (props: EditTextProps, ref) => {
    const { placeholder, width } = props;
    const wrap = width ? "w-[" + width + "]" : "";
    const style = `relative cursor-pointer flex h-auto items-center ${wrap}`;
    console.log("quan:::", style);
    return (
      <div className="w-full">
        <div
          className={`relative flex items-center mt-4 mb-2 w-full min-w-[150px]`}
        >
          <label
            className={`relative cursor-pointer flex h-auto w-full items-center `}
          >
            <input
              type="text"
              placeholder="Input"
              ref={ref}
              className="pt-[12px] pb-[10px] w-full h-full leading-none tracking-wide px-4 text-[16px] text-zinc-800 bg-zinc-200 border-zinc-500 border rounded-md border-opacity-50 outline-none focus:border-zinc-800 hover:border-zinc-800 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
              {...props}
            />
            <span className="text-[16px] text-zinc-500 text-opacity-80 bg-zinc-200 px-1 rounded-md absolute leading-none left-4 top-1/2 translate-y-[-7px] transition duration-200 input-text">
              {placeholder}
            </span>
          </label>
        </div>
      </div>
    );
  }
);
EditText.displayName = "EditText";
export default EditText;

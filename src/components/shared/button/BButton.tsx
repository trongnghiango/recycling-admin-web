import React from "react";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: any;
  label?: string;
  onClick?: (d: any) => void;
}
export const BButton = (props: IProps) => {
  const { label, className, onClick } = props;
  return (
    <div {...props}>
      <button
        onClick={onClick}
        className="h-full w-full bg-[#009ace] transition-all hover:scale-105 px-8 py-2 text-base text-white"
      >
        {label}
      </button>
    </div>
  );
};

import { FC } from "react";
import { useStateValue } from "state/AppProvider";

const style = {
  btnControl: `flex justify-center items-center p-[4px] my-[2px] rounded hover:border-[#a2a2a2] text-gray-400 hover:text-[#00a2d8] `,
};

interface Props {
  label?: string;
  onClick: () => void;
}

export const SuperButton: FC<Props> = ({ label, onClick }) => {
  const { state, dispatch } = useStateValue();
  const { maxi, mand, isSuper, upperAction } = state.teeth;
  const _super = (mand || maxi) && isSuper;
  return (
    <div className={style.btnControl}>
      <button
        className={`relative menuBtn menuBtn-${_super ? "show" : "hide"}`}
        onClick={onClick}
      >
        {label && (
          <span className="absolute bottom-0 text-sm left-1/2 font-light leading-10 translate-y-full -translate-x-1/2">
            {label}
          </span>
        )}
      </button>
    </div>
  );
};

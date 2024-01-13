export default function Loading() {
  return (
    <div className="absolute z-50 top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center w-full">
      <div className="z-40 absolute top-0 bottom-0 left-0 right-0">
        <div className="blur-lg flex h-full bg-green-200 opacity-50"></div>
      </div>
      <div className="relative z-50 h-80 w-80 flex justify-center items-center">
        <div className="absolute flex flex-col items-center justify-center ">
          <div className="w-32 h-32 border-b-2 border-t-2 border-orange-600 rounded-full animate-spin"></div>
        </div>
        <div className="absolute flex items-center justify-center ">
          <div className="w-24 h-24 border-l-2 border-r-2 border-green-600 rounded-full animate-spin-reverse"></div>
        </div>
        <div className="absolute flex items-center justify-center ">
          {/* LOGO */}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export function Slogan() {
  return (
    <div className="z-50 absolute top-0 left-0 p-4 max-w-[500px] hidden lg:block">
      <span className="text-white text-2xl">
        Clear Orthodonic Solution
        <span className="flex text-lg">
          <Link href={"https://www.dentallab.vn"} passHref>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300"
            >
              https://www.dentallab.vn
            </a>
          </Link>
        </span>
      </span>
    </div>
  );
}

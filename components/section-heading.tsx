export default function SectionHeading({
  subheading,
  heading,
  textColor,
}: {
  subheading: string;
  heading: string;
  textColor?: string;
}) {
  return (
    <div className="">
      {/* Pill Component */}
      <div className="flex items-center justify-center mb-4">
        <div className="bg-violet-200 backdrop-blur-sm px-4 py-1 rounded-full shadow-md flex items-center gap-2 border border-[#5C06E5]">
          <span className="text-sm font-semibold text-[#5C06E5]">
            {subheading}
          </span>
        </div>
      </div>
      {/* <h3 className="text-center font-semibold text-indigo-400">
        {subheading}
      </h3> */}
      <h2
        className={`text-center mx-auto mt-2 max-w-xl text-2xl md:text-4xl font-extrabold ${textColor}`}
      >
        {heading}
      </h2>
    </div>
  );
}

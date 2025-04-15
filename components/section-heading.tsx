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
      <h3 className="text-center font-semibold text-indigo-400">
        {subheading}
      </h3>
      <h2
        className={`text-center mx-auto mt-2 max-w-xl text-4xl font-extrabold ${textColor}`}
      >
        {heading}
      </h2>
    </div>
  );
}

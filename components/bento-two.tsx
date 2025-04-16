import SectionHeading from "./section-heading";
import Time from "./lottie/time";
import Returns from "./lottie/returns";
import Style from "./lottie/style";
import Globe from "./lottie/globe";

export default function BentoTwo() {
  const benefits = [
    {
      title: "Style Experimentation",
      description:
        "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
      icon: <Style mode="loop" size="w-16 h-16" />,
    },
    {
      title: "Reduced Returns",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit.",
      icon: <Returns mode="loop" size="w-16 h-16" />,
    },
    {
      title: "Sustainable",
      description:
        "Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.",
      icon: <Globe mode="loop" size="w-16 h-16" />,
    },
    {
      title: "Time Saving",
      description:
        "Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem sodales gravida.",
      icon: <Time mode="loop" size="w-16 h-16" />,
    },
  ];

  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <SectionHeading
          subheading="The Benefits"
          heading="Why try on clothes virtually?"
          textColor="text-black"
        />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* First Square */}
          {benefits.map((item, idx) => (
            <div key={idx}>
              {/* <div className="absolute inset-px rounded-lg bg-white"></div> */}
              <div className="flex h-full flex-col rounded-md border border-gray-200 bg-white">
                <div className="flex flex-col items-center px-8 py-8">
                  {item.icon}
                  <p className="text-lg font-medium tracking-tight text-gray-950 text-center mt-4">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm/6 text-gray-600 text-center">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

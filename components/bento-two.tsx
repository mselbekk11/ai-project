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
        "Discover fresh trends and see what suits you before you spend",
      icon: <Style mode="loop" size="w-16 h-16" />,
    },
    {
      title: "Reduced Returns",
      description:
        "See what fits before buying to avoid disappointing returns later",
      icon: <Returns mode="loop" size="w-16 h-16" />,
    },
    {
      title: "Sustainable",
      description: "Cut down waste by only buying what truly fits and flatters",
      icon: <Globe mode="loop" size="w-16 h-16" />,
    },
    {
      title: "Time Saving",
      description: "No more changing rooms—try on outfits virtually in seconds",
      icon: <Time mode="loop" size="w-16 h-16" />,
    },
  ];

  return (
    <div className="bg-gray-50 py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <SectionHeading
          subheading="The Benefits"
          heading="Why you should use Trizzy?"
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
              {/* <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

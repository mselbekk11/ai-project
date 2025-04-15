import Image from "next/image";
import SectionHeading from "./section-heading";

export default function Video() {
  return (
    <section className="bg-zinc-800 py-24 mx-auto w-full relative">
      <div>
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/stars.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "500px",
            opacity: 0.6,
          }}
        ></div>
        <SectionHeading
          subheading="Virtual Fitting Room"
          heading="Try on clothes virtually"
          textColor="text-white"
        />
        <div className="flex justify-center items-center mt-12 max-w-3xl mx-auto">
          <Image src="/software.png" alt="video" width={1000} height={1000} />
          {/* <div className="bg-gray-300 rounded-md w-full p-2">
        </div> */}
        </div>
      </div>
    </section>
  );
}

import SectionHeading from "./section-heading";

export default function Video() {
  return (
    <section className="bg-zinc-800 py-24 md:py-32 mx-auto w-full relative">
      <div className="max-w-6xl mx-auto">
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
          heading="See how it works"
          textColor="text-white"
        />
        <div className="flex justify-center items-center mt-12 max-w-3xl mx-auto relative z-20 px-4">
          <div className="w-full rounded-lg overflow-hidden shadow-lg shadow-black/80">
            <video
              className="w-full h-auto"
              src="https://polished-bullfrog-577.convex.cloud/api/storage/1624bb2e-df30-41a4-81b4-9499adb28172"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import Image from "next/image";

const images = [
  {
    name: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIA1tOniV9UBSu0Ulsp478qzCKALVMacHmG3yJF",
  },
  {
    name: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIAeTVat9JLGMiuFSV9CWJNbdD7s5f2ERKBUZ6k",
  },
  {
    name: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIADrpImXvsxIqWGrXR6jOoVBNSmn1lyfhCE32D",
  },
  {
    name: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIA4KqOLpSP6WqdcsOnr3wIvY0fyEhG5t9Sb87o",
  },
];

export function InfiniteSliderVertical() {
  return (
    <div className="flex h-screen">
      <InfiniteSlider direction="vertical" speed={20} gap={40} speedOnHover={1}>
        {images.map((item, idx) => (
          <div
            key={idx}
            className="rounded-md overflow-hidden border-4 border-fuchsia-300 bg-purple-700 shadow-lg"
          >
            <Image
              src={item.name}
              alt="me"
              className=""
              width={400}
              height={400}
            />
          </div>
        ))}
        {/* <Image
          src="/me-one.png"
          alt="me"
          className=""
          width={400}
          height={400}
        />
        <Image
          src="/me-two.png"
          alt="me"
          className=""
          width={400}
          height={400}
        />
        <Image
          src="/me-three.png"
          alt="me"
          className=""
          width={400}
          height={400}
        />
        <Image
          src="/me-four.png"
          alt="me"
          className=""
          width={400}
          height={400}
        /> */}
      </InfiniteSlider>
    </div>
  );
}

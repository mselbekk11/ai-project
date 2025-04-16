import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/motion-primitives/accordion";
import { ChevronUp } from "lucide-react";
import SectionHeading from "./section-heading";

const CONTENT = [
  {
    title: "How many images do I need to train a custom model?",
    value: "how-many-images",
    content:
      "Use shots with the subject centered in the frame, Include only one subject per image, Avoid accessories like sunglasses or hats, Ensure the subject is clearly visible in all images. For best results, we recommend using 10-20 high-quality images, some shout be headshots, some should be waist up and some should be full body shots. Remember, the better your input images, the better your AI-generated results will be.",
  },
  {
    title: "How long does it take to train a custom AI model?",
    value: "how-long",
    content:
      "Training custom AI image models takes 15-30 minutes. Once finished, you can generate custom images with it in <30 seconds.",
  },
  {
    title: "Who owns my AI photos?",
    value: "who-owns",
    content:
      "You do. We grant you full commercial license and ownership over your photos.",
  },

  {
    title: "What do people misunderstand about AI headshots?",
    value: "people-misunderstand",
    content:
      "Not every photo is perfect. Due to the nature of AI, you might see some strange photos.",
  },
  {
    title: "Can I use the generated images commercially?",
    value: "use-commercially",
    content:
      "Yes, all our plans offer full, commercial ownership of the images you generate. This means you can use the AI-generated images without any restrictions.",
  },
  {
    title: "Do you offer support for using the platform?",
    value: "platform-support",
    content:
      "Yes, we provide comprehensive support to help you succeed with our platform. Our team offers guidance and assistance to ensure you get the most out of our services.",
  },
];

export function Faq() {
  return (
    <div className="relative mx-auto w-full px-6 py-32 bg-gray-50">
      <div className="mb-24">
        <SectionHeading
          subheading="Answers to common questions"
          heading="Frequently Asked Questions"
          textColor="text-black"
        />
      </div>
      <div className="border border-gray-200 bg-white rounded-md px-6 py-2 max-w-6xl mx-auto">
        <Accordion
          className="flex w-full flex-col divide-y divide-zinc-200 dark:divide-zinc-700"
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {CONTENT.map((item, index) => (
            <AccordionItem
              value={item.value}
              className={`py-4 ${index === 0 ? "border-t-0" : "border-t border-zinc-200 dark:border-zinc-700"}`}
              key={item.value}
            >
              <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
                <div className="flex items-center justify-between">
                  <div>{item.title}</div>
                  <ChevronUp className="h-4 w-4 -rotate-180 text-zinc-950 transition-transform duration-200 group-data-[expanded]:rotate-0 dark:text-zinc-50" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="pt-2 text-zinc-500 dark:text-zinc-400">
                  {item.content}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

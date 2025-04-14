import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/motion-primitives/accordion";
import { ChevronUp } from "lucide-react";

const CONTENT = [
  {
    title: "Getting Started",
    value: "getting-started",
    content:
      "Discover the fundamental concepts of Motion-Primitives. This section guides you through the installation process and provides an overview of how to integrate these components into your projects. Learn about the core functionalities and how to set up your first animation effectively.",
  },
  {
    title: "Animation Properties",
    value: "animation-properties",
    content:
      "Explore the comprehensive range of animation properties available in Motion-Primitives. Understand how to manipulate timing, easing, and delays to create smooth, dynamic animations. This segment also covers the customization of animations to fit the flow and style of your web applications.",
  },
  {
    title: "Advanced Usage",
    value: "advanced-usage",
    content:
      "Dive deeper into advanced techniques and features of Motion-Primitives. Learn about chaining animations, creating complex sequences, and utilizing motion sensors for interactive animations. Gain insights on how to leverage these advanced features to enhance user experience and engagement.",
  },
  {
    title: "Community and Support",
    value: "community-and-support",
    content:
      "Engage with the Motion-Primitives community to gain additional support and insight. Find out how to participate in discussions, contribute to the project, and access a wealth of shared knowledge and resources. Learn about upcoming features, best practices, and how to get help with your specific use cases.",
  },
];

export function Faq() {
  return (
    <div className="relative mx-auto max-w-6xl px-6 py-12 bg-white-200 w-full">
      <div className="mb-10 text-left">
        {/* <h2 className="mb-4 text-2xl font-medium text-zinc-900 dark:text-white">
          Frequently asked questions
        </h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          Here are some of the most common questions we receive from our users.
        </p> */}

        {/* <div className="flex flex-col items-center">
          <h1 className="mt-8 text-4xl font-extrabold md:text-5xl xl:text-4xl xl:[line-height:1.125]">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-8 text-wrap text-md ">
            Here are some of the most common questions we receive from our
            users.
          </p>
        </div> */}
        <div className="mx-auto max-w-6xl space-y-2 text-center">
          <p className="font-semibold text-indigo-400">Award winning support</p>
          <h1 className="text-4xl font-extrabold md:text-5xl xl:text-4xl xl:[line-height:1.125]">
          Frequently asked questions
          </h1>
          <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-md sm:block">
          Here are some of the most common questions we receive from our
          users.
          </p>
        </div>
      </div>
      <Accordion
        className="flex w-full flex-col divide-y divide-zinc-200 border-t border-zinc-200 dark:divide-zinc-700 dark:border-zinc-700"
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {CONTENT.map((item) => (
          <AccordionItem value={item.value} className="py-4" key={item.value}>
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
  );
}

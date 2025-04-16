import { TextEffect } from "@/components/motion-primitives/text-effect";
import { Plus, X } from "lucide-react";
// import GitHubIcon from '../website/icons/github';
// import XIcon from '../website/icons/x';

export function FooterTwo() {
  return (
    <footer className="bg-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col justify-center px-6 py-12 md:flex-row md:justify-between md:px-8">
        <TextEffect className="text-sm text-zinc-500">
          {`© ${new Date().getFullYear()} Motion Primitives, Inc. All rights reserved.`}
        </TextEffect>
        <div className="order-first mb-4 flex items-center gap-x-6 md:order-none md:mb-0">
          <a
            href="#"
            className="fill-zinc-500 hover:fill-zinc-900 dark:fill-zinc-400 dark:hover:fill-zinc-100"
          >
            <Plus className="h-4 w-4" />
          </a>
          <a
            href="#"
            className="fill-zinc-500 hover:fill-zinc-900 dark:fill-zinc-400 dark:hover:fill-zinc-100"
          >
            <X className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

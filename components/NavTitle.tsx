"use client";

import { usePathname } from "next/navigation";
import { FC } from "react";

const NavTitle: FC = () => {
  const pathname = usePathname();

  const title =
    pathname === "/home"
      ? "Try on Clothes"
      : pathname === "/train-model"
        ? "Train Model"
        : pathname === "/gallery"
          ? "Gallery"
          : "";

  return <div className="text-md text-default font-semibold">{title}</div>;
};

export default NavTitle;

"use client";

import { usePathname } from "next/navigation";
import { FC } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const NavTitle: FC = () => {
  const pathname = usePathname();

  const title =
    pathname === "/home" ? (
      <Link href="/train-model">
        <Button size="sm">Train Model</Button>
      </Link>
    ) : pathname === "/train-model" ? (
      ""
    ) : (
      ""
    );

  return <div className="text-md text-default font-semibold">{title}</div>;
};

export default NavTitle;

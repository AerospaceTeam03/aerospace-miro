import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MobileSheetButton from "@/components/shared/atoms/MobileSheetButton";
import { cn } from "@/lib/utils";
import { sidebarLinks } from "@/types/navigation";
import { Boxes, Menu } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";

export default function MobileTopbar({ className }: ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "border-border flex h-16 items-center justify-between border-b p-5",
        className
      )}
    >
      <Link
        href="/"
        className="flex cursor-pointer items-center gap-2"
      >
        <Boxes className="text-primary size-8 shrink-0" />
        <span className="text-foreground text-xl font-bold">App</span>
      </Link>
      <Sheet>
        <SheetTrigger
          aria-label="Open navigation"
          className="cursor-pointer"
        >
          <Menu className="size-7" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-background w-5/8"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation
          </SheetDescription>
          <SheetClose asChild>
            <Link
              href="/"
              className="flex cursor-pointer items-center gap-2 px-4"
            >
              <Boxes className="text-primary size-8 shrink-0" />
              <h1 className="text-foreground text-2xl leading-8 font-bold">
                App
              </h1>
            </Link>
          </SheetClose>
          <nav className="flex flex-col gap-4 overflow-y-auto px-4 pt-8">
            {sidebarLinks.map((item) => {
              return (
                <SheetClose
                  asChild
                  key={item.route}
                >
                  <MobileSheetButton
                    route={item.route}
                    label={item.label}
                    icon={<item.icon className="size-6 shrink-0" />}
                  />
                </SheetClose>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

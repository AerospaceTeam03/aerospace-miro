import MobileTopbar from "@/components/shared/organisms/MobileTopbar";
import Sidebar from "@/components/shared/organisms/Sidebar";
import Topbar from "@/components/shared/organisms/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid h-dvh grid-rows-[auto_1fr] md:grid-cols-[auto_1fr]">
      <MobileTopbar className="md:hidden" />
      <Sidebar className="row-span-2 hidden md:flex" />
      <Topbar className="hidden" />

      <main className="flex flex-col overflow-x-hidden overflow-y-auto p-2 md:gap-4 md:p-4 lg:px-8">
        {children}
      </main>
    </div>
  );
}

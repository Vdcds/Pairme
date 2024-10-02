import Home from "@/components/Homepage";

export default function Page({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  return (
    <main className="flex items-center justify-center w-full">
      <Home searchParams={searchParams} />
    </main>
  );
}

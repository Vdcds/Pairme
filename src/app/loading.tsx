function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-secondary/75 ${className}`} />;
}

export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <Bar className="h-4 w-32" />
        <Bar className="h-12 w-full max-w-xl" />
        <Bar className="h-5 w-full max-w-2xl" />
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => <Bar key={item} className="h-52 w-full" />)}
      </div>
    </main>
  );
}

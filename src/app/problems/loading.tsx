export default function Loading() {
  return <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="animate-pulse"><div className="h-5 w-40 rounded-full bg-secondary" /><div className="mt-4 h-12 max-w-xl rounded-2xl bg-secondary" /><div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="h-64 rounded-[26px] border border-border bg-card" />)}</div></div></main>;
}

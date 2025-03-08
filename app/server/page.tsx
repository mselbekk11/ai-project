import Home from "./inner";

export default async function ServerPage() {
  return (
    <main className="p-8 flex flex-col gap-4 mx-auto max-w-2xl">
      <h1 className="text-4xl font-bold text-center">Convex + Next.js</h1>
      <div className="flex flex-col gap-4 bg-slate-200 dark:bg-slate-800 p-4 rounded-md">
        <h2 className="text-xl font-bold">Non-reactive server-loaded data</h2>
        <code></code>
      </div>
      <Home />
    </main>
  );
}

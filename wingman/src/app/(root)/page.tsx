export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Landing page. Add routes
        under <code className="font-mono">src/app</code>; build features under{" "}
        <code className="font-mono">src/components/features</code>.
      </p>
    </div>
  );
}

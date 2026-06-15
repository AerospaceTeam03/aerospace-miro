export default async function TailTrackerPage({
  params,
}: {
  params: Promise<{ tail: string }>;
}) {
  const { tail } = await params;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Tail Tracker</h1>
      <p className="text-muted-foreground">
        Rotation timeline for tail <strong>{decodeURIComponent(tail)}</strong>{" "}
        — today&apos;s legs, cascading delay and crew duty limit risk to be
        added here.
      </p>
    </div>
  );
}

import { buttonVariants } from "@sema/ui/components/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 font-sans">
      <h1 className="text-3xl font-semibold">Sema SaaS</h1>
      <a
        href="https://ui.shadcn.com/docs"
        className={buttonVariants({ variant: "outline" })}
      >
        shadcn/ui documentation
      </a>
    </main>
  );
}

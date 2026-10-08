import Link from "next/link";
import ScrambleText from "@/components/fx/ScrambleText";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-dvh flex-col items-start justify-center gap-6">
      <span className="eyebrow">Error 404</span>
      <ScrambleText
        as="h1"
        text="Lost in space"
        className="font-display text-[clamp(3rem,12vw,10rem)] leading-[0.9] font-extrabold tracking-tight uppercase"
      />
      <p className="text-fg/70">This page drifted out of orbit. Try the terminal (press `) or head home.</p>
      <Link href="/" className="rounded-full bg-fg px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent">
        Take me home
      </Link>
    </main>
  );
}

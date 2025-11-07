import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

const missionPoints = [
  {
    title: "Predict demand accurately",
    description:
      "Employees lock in their meal plan by 5 PM. Smart defaults honour dietary notes and typical behaviour.",
  },
  {
    title: "Reduce avoidable waste",
    description:
      "Live dashboards surface procurement signals, low-stock alerts, and leftover donation opportunities.",
  },
  {
    title: "Close the feedback loop",
    description:
      "Taste, nutrition, and operations feedback flows back to menu planners within 24 hours.",
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  if (session?.user?.role === "employee") {
    redirect("/employee");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.1),transparent)]" />

      <header className="relative z-10 flex w-full max-w-6xl flex-col gap-8 text-center">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-1 text-xs uppercase tracking-[0.2em] text-sky-300">
          Karmic Canteen App
        </span>
        <h1 className="text-5xl font-semibold leading-tight text-white md:text-6xl">
          Feed people, not waste.
        </h1>
        <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
          An end-to-end meal planning and analytics platform connecting every
          Karmic Solutions employee with canteen operations. Personalised menus,
          proactive confirmations, and procurement intelligence deliver a
          climate-positive dining experience.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
          >
            Access your dashboard
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="#capabilities"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            Explore capabilities
          </Link>
        </div>
      </header>

      <section
        id="capabilities"
        className="relative z-10 mt-20 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3"
      >
        {missionPoints.map((point) => (
          <article
            key={point.title}
            className="flex h-full flex-col gap-4 rounded-3xl border border-slate-800/70 bg-slate-900/40 p-6 text-left transition hover:border-sky-500/50 hover:bg-slate-900/70"
          >
            <h3 className="text-lg font-semibold text-white">{point.title}</h3>
            <p className="text-sm leading-relaxed text-slate-300">
              {point.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

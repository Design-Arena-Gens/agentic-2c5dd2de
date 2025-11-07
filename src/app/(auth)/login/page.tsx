"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

const sampleAccounts = [
  {
    label: "Employee (Product Design)",
    email: "anika.rao@karmic.solutions",
    password: "employee123",
  },
  {
    label: "Employee (Engineering)",
    email: "jay.mehta@karmic.solutions",
    password: "employee123",
  },
  {
    label: "Canteen Admin",
    email: "ria.kapoor@karmic.solutions",
    password: "admin123",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: callbackUrl ?? undefined,
    });

    setIsLoading(false);

    if (!result || result.error) {
      setError("We couldn’t verify those credentials. Try again.");
      return;
    }

    router.push(callbackUrl ?? "/");
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-10 rounded-3xl border border-slate-800/60 bg-slate-950/70 p-10 backdrop-blur-md sm:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-center gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/50 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
            Karmic Canteen Platform
          </span>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            Log in with your Karmic ID
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
            Confirm meals in advance, personalise your nutrition plan, and help
            the canteen team combat food waste through real-time participation
            insights.
          </p>
          <ul className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 text-sm text-slate-200">
            {sampleAccounts.map((account) => (
              <li
                key={account.email}
                className="flex items-center justify-between gap-4 rounded-xl bg-slate-900/40 px-3 py-3 font-mono text-xs text-slate-300 transition hover:bg-slate-900/70 md:text-sm"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-sky-300">{account.label}</p>
                  <p>Email: {account.email}</p>
                  <p>Password: {account.password}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col justify-center rounded-3xl border border-slate-800/60 bg-slate-950/70 p-8 shadow-[0_35px_120px_-40px_rgba(56,189,248,0.35)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Corporate Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40"
                placeholder="you@karmic.solutions"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Authenticating…" : "Access dashboard"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Need access?{" "}
            <Link
              href="mailto:canteen-support@karmic.solutions"
              className="text-sky-300 underline-offset-2 hover:underline"
            >
              Contact Karmic canteen operations.
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

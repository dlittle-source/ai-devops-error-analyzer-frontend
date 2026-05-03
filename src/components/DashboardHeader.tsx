export default function DashboardHeader() {
  return (
    <header className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
        AI DevOps Error Analyzer
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
        Diagnose infrastructure and application errors faster.
      </h1>

      <p className="mt-4 max-w-3xl text-slate-300">
        Paste Docker, AWS, Linux, CI/CD, or application errors and receive root
        cause analysis, severity, recommended fixes, commands, and prevention tips.
      </p>
    </header>
  );
}
type RecentIncidentsProps = {
  incidents: any[];
  onSelectIncident: (incident: any) => void;
};

function getSeverityStyles(severity?: string) {
  const normalizedSeverity = severity?.toLowerCase();

  if (normalizedSeverity === "critical" || normalizedSeverity === "high") {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  if (normalizedSeverity === "medium" || normalizedSeverity === "moderate") {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }

  if (normalizedSeverity === "low") {
    return "border-green-500/30 bg-green-500/10 text-green-300";
  }

  return "border-slate-600 bg-slate-800 text-slate-300";
}

function formatTimestamp(timestamp?: string) {
  if (!timestamp) return "Recently analyzed";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Recently analyzed";
  }

  return date.toLocaleString();
}

export default function RecentIncidents({
  incidents,
  onSelectIncident,
}: RecentIncidentsProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Recent Incidents
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Persistent incident history from this browser.
          </p>
        </div>

        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-300">
          {incidents.length} tracked
        </span>
      </div>

      {incidents.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-5">
          <p className="text-sm font-medium text-slate-300">
            No incidents analyzed yet.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Run an analysis and your incident history will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {incidents.map((incident) => {
            const severity = incident.analysis?.severity || "Unknown";

            return (
              <button
                key={incident.id}
                type="button"
                onClick={() => onSelectIncident(incident)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-left transition hover:border-cyan-500 hover:bg-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">
                      {incident.analysis?.category || "Unknown Incident"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatTimestamp(incident.timestamp)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getSeverityStyles(
                      severity
                    )}`}
                  >
                    {severity}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
                  {incident.analysis?.summary || "No summary available."}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
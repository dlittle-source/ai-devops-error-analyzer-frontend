"use client";

import { useState } from "react";

type AnalysisResultProps = {
  result: any;
  onAnalyzeAgain?: () => void;
  onRunDeepAnalysis?: () => void;
};

function getAnalysisModeLabel(mode?: string) {
  if (!mode) return "Standard";

  const labels: Record<string, string> = {
    General: "General",
    Deep: "Deep Analysis",
    standard: "Standard",
    deep: "Deep Analysis",
    quick: "Quick Scan",
    security: "Security Review",
    deployment: "Deployment Issue",
  };

  return labels[mode] || mode;
}

function formatValue(value: any) {
  if (Array.isArray(value)) return value.join("\n");
  return value || "Not provided";
}

function buildFullAnalysisReport(analysis: any) {
  return `AI DevOps Error Analyzer - Analysis Report

Severity:
${formatValue(analysis?.severity)}

Category:
${formatValue(analysis?.category)}

Confidence Score:
${formatValue(analysis?.confidence)}%

Summary:
${formatValue(analysis?.summary)}

Root Cause:
${formatValue(analysis?.probable_cause)}

Recommended Fix:
${formatValue(analysis?.fix_steps)}

Troubleshooting Commands:
${formatValue(analysis?.commands_to_try)}

Prevention Tips:
${formatValue(analysis?.prevention_tip)}
`;
}

export default function AnalysisResult({
  result,
  onAnalyzeAgain,
  onRunDeepAnalysis,
}: AnalysisResultProps) {
  if (!result) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">Analysis Results</h2>

        <p className="mt-4 text-slate-400">
          Your AI-powered diagnosis will appear here after analysis.
        </p>
      </section>
    );
  }

  const analysis = result.analysis;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl">
      <h2 className="text-xl font-semibold text-white">Analysis Results</h2>

      <div className="mt-5 space-y-5">
        <IncidentSummaryBanner
          analysis={analysis}
          analysisMode={result?.analysis_mode || result?.mode}
          onRunDeepAnalysis={onRunDeepAnalysis}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <ExportReportButton analysis={analysis} />
          <CopyFullAnalysisButton analysis={analysis} />
        </div>

        {onAnalyzeAgain && (
          <button
            type="button"
            onClick={onAnalyzeAgain}
            className="w-full rounded-xl border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
          >
            Analyze Again
          </button>
        )}

        <ResultCard title="Category" value={analysis?.category} />
        <ConfidenceCard confidence={analysis?.confidence} />
        <ResultCard title="Summary" value={analysis?.summary} />
        <ResultCard title="Root Cause" value={analysis?.probable_cause} />
        <SeverityCard severity={analysis?.severity} />
        <ResultCard title="Recommended Fix" value={analysis?.fix_steps} />
        <CommandsCard commands={analysis?.commands_to_try} />
        <ResultCard title="Prevention Tips" value={analysis?.prevention_tip} />
      </div>
    </section>
  );
}

function CopyFullAnalysisButton({ analysis }: { analysis: any }) {
  const [copied, setCopied] = useState(false);

  async function handleCopyFullAnalysis() {
    try {
      await navigator.clipboard.writeText(buildFullAnalysisReport(analysis));
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Failed to copy full analysis", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopyFullAnalysis}
      className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
    >
      {copied ? "Copied Full Analysis" : "Copy Full Analysis"}
    </button>
  );
}

function ExportReportButton({ analysis }: { analysis: any }) {
  function handleExport() {
    const report = buildFullAnalysisReport(analysis);

    const blob = new Blob([report], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ai-devops-incident-report.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="w-full rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
    >
      Export Incident Report
    </button>
  );
}

function IncidentSummaryBanner({
  analysis,
  analysisMode,
  onRunDeepAnalysis,
}: {
  analysis: any;
  analysisMode?: string;
  onRunDeepAnalysis?: () => void;
}) {
  const severity = analysis?.severity || "Unknown";
  const category = analysis?.category || "Uncategorized";
  const confidence = analysis?.confidence ?? 0;
  const cause = analysis?.probable_cause || "Root cause not yet identified.";
  const normalizedSeverity = severity.toLowerCase();

  const incidentText = [
    analysis?.summary,
    analysis?.probable_cause,
    analysis?.category,
  ]
    .join(" ")
    .toLowerCase();

  const incidentStatus =
    normalizedSeverity === "critical" || normalizedSeverity === "high"
      ? "ACTIVE INCIDENT"
      : normalizedSeverity === "medium" || normalizedSeverity === "moderate"
      ? "DEGRADED SERVICE"
      : normalizedSeverity === "low"
      ? "MONITORING"
      : "UNKNOWN STATUS";

  const recommendedPriority =
    normalizedSeverity === "critical"
      ? "Immediate Action Required"
      : normalizedSeverity === "high"
      ? "Investigate Within 15 Minutes"
      : normalizedSeverity === "medium" || normalizedSeverity === "moderate"
      ? "Investigate Within 1 Hour"
      : normalizedSeverity === "low"
      ? "Monitor Closely"
      : "Needs Further Review";

  const bannerStyles =
    normalizedSeverity === "critical" || normalizedSeverity === "high"
      ? "border-red-500/40 bg-red-500/10"
      : normalizedSeverity === "medium" || normalizedSeverity === "moderate"
      ? "border-yellow-500/40 bg-yellow-500/10"
      : normalizedSeverity === "low"
      ? "border-green-500/40 bg-green-500/10"
      : "border-slate-700 bg-slate-900";

  return (
    <div className={`rounded-xl border p-5 ${bannerStyles}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`h-3 w-3 rounded-full animate-pulse ${
              normalizedSeverity === "critical" || normalizedSeverity === "high"
                ? "bg-red-400"
                : normalizedSeverity === "medium" ||
                  normalizedSeverity === "moderate"
                ? "bg-yellow-400"
                : normalizedSeverity === "low"
                ? "bg-green-400"
                : "bg-slate-400"
            }`}
          />

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Incident Overview
          </p>
        </div>

        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
          {getAnalysisModeLabel(analysisMode)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h3 className="text-2xl font-bold text-white">
          {severity} Severity Incident Detected
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
            normalizedSeverity === "critical" || normalizedSeverity === "high"
              ? "bg-red-500/20 text-red-300 border border-red-500/30"
              : normalizedSeverity === "medium" ||
                normalizedSeverity === "moderate"
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
              : normalizedSeverity === "low"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-slate-700 text-slate-300 border border-slate-600"
          }`}
        >
          {incidentStatus}
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        Analyzed at: {new Date().toLocaleString()}
      </p>

      <div className="mt-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          AI Recommended Priority
        </span>

        <p className="mt-1 text-sm font-semibold text-white">
          {recommendedPriority}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-semibold text-cyan-300">
            <span>Why did AI classify this incident this way?</span>

            <span className="transition-transform group-open:rotate-180">▼</span>
          </summary>

          <div className="border-t border-slate-800 p-4 text-sm text-slate-300">
            <ul className="space-y-2">
              <li>• Severity assessment was based on detected incident impact.</li>
              <li>• AI evaluated the probable root cause and operational risk indicators.</li>
              <li>• Infrastructure keywords and service failure patterns influenced classification.</li>
              <li>• Confidence scoring contributed to the recommended response priority.</li>
            </ul>
          </div>
        </details>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            document
              .getElementById("recommended-fix")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
        >
          Generate Remediation Plan
        </button>

        <button
          type="button"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          Escalate Incident
        </button>

        <button
          type="button"
          onClick={onRunDeepAnalysis}
          className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/20"
        >
          Run Deep Analysis
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {incidentText.includes("aws") && (
          <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
            AWS
          </span>
        )}

        {incidentText.includes("docker") && (
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
            Docker
          </span>
        )}

        {incidentText.includes("nginx") && (
          <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">
            Nginx
          </span>
        )}

        {incidentText.includes("kubernetes") && (
          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
            Kubernetes
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-3">
        <div>
          <p className="text-slate-400">Category</p>
          <p className="font-semibold text-white">{category}</p>
        </div>

        <div>
          <p className="text-slate-400">Confidence</p>
          <p className="font-semibold text-white">{confidence}%</p>
        </div>

        <div>
          <p className="text-slate-400">Primary Cause</p>
          <p className="font-semibold text-white">{cause}</p>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ title, value }: { title: string; value: any }) {
  const sectionId = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      id={sectionId}
      className="rounded-xl border border-slate-800 bg-slate-900/80 p-4"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
        {title}
      </h3>

      <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200">
        {Array.isArray(value) ? value.join("\n") : value || "Not provided"}
      </div>
    </div>
  );
}

function ConfidenceCard({ confidence }: { confidence: number }) {
  const safeConfidence =
    typeof confidence === "number" ? Math.min(Math.max(confidence, 0), 100) : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
          Confidence Score
        </h3>

        <span className="text-sm font-semibold text-slate-200">
          {safeConfidence}%
        </span>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all"
          style={{ width: `${safeConfidence}%` }}
        />
      </div>
    </div>
  );
}

function CommandsCard({ commands }: { commands: any }) {
  const formattedCommands = Array.isArray(commands)
    ? commands.join("\n")
    : commands || "No commands provided";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formattedCommands);
    } catch (error) {
      console.error("Failed to copy commands", error);
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
          Troubleshooting Commands
        </h3>

        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-lg border border-cyan-500/40 px-3 py-1 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/10"
        >
          Copy Commands
        </button>
      </div>

      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-200">
        {formattedCommands}
      </pre>
    </div>
  );
}

function SeverityCard({ severity }: { severity: string }) {
  const normalizedSeverity = severity?.toLowerCase();

  const severityStyles =
    normalizedSeverity === "critical" || normalizedSeverity === "high"
      ? "border-red-500/40 bg-red-500/10 text-red-300"
      : normalizedSeverity === "medium" || normalizedSeverity === "moderate"
      ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-300"
      : normalizedSeverity === "low"
      ? "border-green-500/40 bg-green-500/10 text-green-300"
      : "border-slate-700 bg-slate-800 text-slate-300";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
        Severity
      </h3>

      <div
        className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${severityStyles}`}
      >
        {severity || "Not provided"}
      </div>
    </div>
  );
}
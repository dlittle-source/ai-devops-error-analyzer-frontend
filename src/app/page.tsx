"use client";

import { useEffect, useState } from "react";

import DashboardHeader from "@/components/DashboardHeader";
import ErrorInput from "@/components/ErrorInput";
import AnalysisResult from "@/components/AnalysisResult";
import RecentIncidents from "@/components/RecentIncidents";

import { analyzeError } from "@/lib/api";

export default function Home() {
  const [errorText, setErrorText] = useState("");
  const [selectedMode, setSelectedMode] = useState("General");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [incidentHistory, setIncidentHistory] = useState<any[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(
      "ai-devops-incident-history"
    );

    if (savedHistory) {
      try {
        setIncidentHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error(
          "Failed to parse incident history",
          error
        );
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ai-devops-incident-history",
      JSON.stringify(incidentHistory)
    );
  }, [incidentHistory]);

  async function handleAnalyze() {
    try {
      setIsLoading(true);
      setResult(null);

      const data = await analyzeError(
        errorText,
        selectedMode
      );

      setResult(data);

      if (data?.analysis) {
        setIncidentHistory((prev) => [
          {
            id: Date.now(),
            analysis: data.analysis,
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    } catch (error) {
      setResult({
        analysis: {
          category: "System Error",
          confidence: 0,
          summary:
            "Unable to analyze the error.",
          probable_cause:
            "The frontend could not reach the backend API.",
          severity: "Unknown",
          fix_steps:
            "Check that your backend API is running and NEXT_PUBLIC_API_URL is correct.",
          commands_to_try: [
            "curl $NEXT_PUBLIC_API_URL/health",
            "npm run dev",
          ],
          prevention_tip:
            "Validate environment variables and backend health before running analysis.",
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleAnalyzeAgain() {
    setErrorText("");
    setSelectedMode("General");
    setResult(null);

    setTimeout(() => {
      document
        .getElementById("analysis-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  function handleRunDeepAnalysis() {
    setSelectedMode("Deep");

    setTimeout(() => {
      document
        .getElementById("analysis-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  function handleClearHistory() {
    setIncidentHistory([]);

    localStorage.removeItem(
      "ai-devops-incident-history"
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader />

        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Incident History
            </h2>

            {incidentHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
              >
                Clear Incident History
              </button>
            )}
          </div>

          <RecentIncidents
            incidents={incidentHistory}
            onSelectIncident={(incident) =>
              setResult({
                analysis: incident.analysis,
              })
            }
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div id="analysis-form">
            <ErrorInput
              errorText={errorText}
              setErrorText={setErrorText}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </div>

          <AnalysisResult
            result={result}
            onAnalyzeAgain={
              handleAnalyzeAgain
            }
            onRunDeepAnalysis={
              handleRunDeepAnalysis
            }
          />
        </div>
      </div>
    </main>
  );
}
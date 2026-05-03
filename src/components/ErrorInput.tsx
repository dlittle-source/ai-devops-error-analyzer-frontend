"use client";

import { DragEvent, useEffect, useState } from "react";

type ErrorInputProps = {
  errorText: string;
  setErrorText: (value: string) => void;
  selectedMode: string;
  setSelectedMode: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
};

const analysisModes = [
  "General",
  "Deep",
  "Docker",
  "Nginx",
  "AWS ECS",
  "CI/CD",
  "Node.js",
  "Linux Service",
];

const sampleErrors = [
  {
    title: "Docker Restart Loop",
    error: `docker ps shows container restarting repeatedly

Container: api-service
Status: Restarting (1) 10 seconds ago

Logs:
Error: Cannot find module '/app/server.js'
npm ERR! command failed
npm ERR! exit code 1`,
  },
  {
    title: "Nginx 502 Error",
    error: `502 Bad Gateway
nginx/1.24.0

connect() failed (111: Connection refused) while connecting to upstream
upstream: "http://127.0.0.1:3000/"

systemctl status app:
Active: inactive (dead)`,
  },
  {
    title: "GitHub Actions Failure",
    error: `GitHub Actions deployment failed

Run npm ci
npm ERR! code ELOCKVERIFY
npm ERR! package-lock.json is out of sync with package.json

Process completed with exit code 1`,
  },
  {
    title: "AWS ECS Task Failure",
    error: `AWS ECS task stopped unexpectedly

Stopped reason:
Essential container in task exited

Container logs:
Error: listen EADDRINUSE: address already in use 0.0.0.0:3000

Exit code: 1`,
  },
];

const loadingMessages = [
  "Inspecting infrastructure signals...",
  "Reviewing logs and failure patterns...",
  "Identifying probable root cause...",
  "Evaluating severity and impact...",
  "Generating remediation guidance...",
];

export default function ErrorInput({
  errorText,
  setErrorText,
  selectedMode,
  setSelectedMode,
  onAnalyze,
  isLoading,
}: ErrorInputProps) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStep((prev) =>
        prev === loadingMessages.length - 1 ? 0 : prev + 1
      );
    }, 1400);

    return () => clearInterval(interval);
  }, [isLoading]);

  async function processFile(file: File) {
    const isAllowedFile =
      file.type === "text/plain" ||
      file.type === "application/octet-stream" ||
      file.name.endsWith(".log") ||
      file.name.endsWith(".txt");

    if (!isAllowedFile) {
      alert("Please upload a .txt or .log file.");
      return;
    }

    const text = await file.text();
    setErrorText(text);
  }

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    await processFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    await processFile(file);
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl">
      <h2 className="text-xl font-semibold text-white">Error Input</h2>

      <p className="mt-2 text-sm text-slate-400">
        Paste logs, stack traces, cloud errors, or failed deployment output.
      </p>

      <div id="analysis-mode-selector" className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
          Analysis Mode
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Select the environment or failure category to give the AI better
          context.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {analysisModes.map((mode) => (
            <button
              key={mode}
              type="button"
              disabled={isLoading}
              onClick={() => setSelectedMode(mode)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                selectedMode === mode
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-500"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white">
          Try Sample Errors
        </h3>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sampleErrors.map((item) => (
            <button
              key={item.title}
              type="button"
              disabled={isLoading}
              onClick={() => setErrorText(item.error)}
              className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <p className="font-medium text-white">{item.title}</p>

              <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                {item.error}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-6 rounded-xl border border-dashed p-5 transition ${
          isDragging
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-slate-700 bg-slate-900/60"
        }`}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
          Upload Log File
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Drag and drop a .log or .txt file here, or upload one below.
        </p>

        <input
          type="file"
          accept=".txt,.log,text/plain"
          disabled={isLoading}
          onChange={handleFileUpload}
          className="mt-4 block w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-900 text-sm text-slate-300 file:mr-4 file:border-0 file:bg-cyan-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cyan-300 hover:file:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
          Error / Log Output
        </label>

        <textarea
          value={errorText}
          disabled={isLoading}
          onChange={(event) => setErrorText(event.target.value)}
          placeholder="Paste your error logs, stack trace, deployment failure, Docker logs, Nginx errors, AWS ECS task failure, or CI/CD output here..."
          className="mt-3 min-h-[260px] w-full resize-y rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {isLoading && (
        <div className="mt-5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-5">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />

            <p className="text-sm font-semibold text-cyan-300">
              AI investigation in progress
            </p>
          </div>

          <p className="mt-3 text-sm text-slate-300">
            {loadingMessages[loadingStep]}
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-500"
              style={{
                width: `${((loadingStep + 1) / loadingMessages.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onAnalyze}
        disabled={isLoading || errorText.trim().length === 0}
        className="mt-6 w-full rounded-xl bg-cyan-500 px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {isLoading
          ? "Analyzing Infrastructure Signals..."
          : selectedMode === "Deep"
          ? "Run Deep Analysis"
          : "Analyze Error"}
      </button>
    </section>
  );
}
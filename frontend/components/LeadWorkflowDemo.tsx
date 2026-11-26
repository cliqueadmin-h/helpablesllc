'use client';

import { useState } from 'react';

const scenarios = {
  new: {
    label: 'New inquiry',
    description: 'A homeowner requests a quote through a website form.',
    steps: [
      ['Capture', 'Save quote request'],
      ['Handoff', 'Assign to service inbox'],
      ['Notify', 'Send the owner an alert'],
    ],
    result: 'Inquiry saved and owner alerted',
  },
  duplicate: {
    label: 'Duplicate inquiry',
    description: 'The same quote request arrives a second time.',
    steps: [
      ['Capture', 'Match the existing request'],
      ['Handoff', 'Keep the existing assignment'],
      ['Notify', 'Skip the duplicate alert'],
    ],
    result: 'One inquiry and one alert',
  },
  failure: {
    label: 'Delivery failure',
    description: 'The alert provider reports a temporary delivery failure.',
    steps: [
      ['Capture', 'Keep the saved request'],
      ['Retry', 'Retry the alert with the same delivery key'],
      ['Notify', 'Record the successful retry'],
    ],
    result: 'Alert delivered on retry',
  },
} as const;

type Scenario = keyof typeof scenarios;

export default function LeadWorkflowDemo() {
  const [selection, setSelection] = useState<Scenario>('new');
  const [hasRun, setHasRun] = useState(false);
  const scenario = scenarios[selection];

  return (
    <section
      id="workflow-demo"
      aria-labelledby="workflow-demo-title"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white shadow-[0_22px_70px_-38px_rgba(15,23,42,0.45)] dark:border-[#29483f] dark:bg-[#101e22] dark:shadow-[0_22px_70px_-34px_rgba(16,185,129,0.35)]"
    >
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-[#29483f] sm:px-6">
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-[#193d32] dark:text-emerald-300">
          <span className="h-2.5 w-2.5 rounded-sm border-2 border-current" />
        </span>
        <div>
          <h2 id="workflow-demo-title" className="text-sm font-semibold text-slate-950 dark:text-white sm:text-base">Lead workflow demo</h2>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">Simulated data. Runs in your browser.</p>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Demo scenario">
          {(Object.keys(scenarios) as Scenario[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={selection === key}
              onClick={() => {
                setSelection(key);
                setHasRun(false);
              }}
              className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 aria-pressed:border-emerald-500 aria-pressed:bg-emerald-50 aria-pressed:text-emerald-950 dark:border-slate-600 dark:text-slate-200 dark:aria-pressed:border-emerald-500 dark:aria-pressed:bg-[#193d32] dark:aria-pressed:text-emerald-200"
            >
              {scenarios[key].label}
            </button>
          ))}
        </div>
        <p className="mb-4 mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{scenario.description}</p>
        <ol className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50 px-4 dark:divide-[#29483f] dark:border-[#29483f] dark:bg-[#111a1d]">
          {scenario.steps.map(([label, action]) => (
            <li key={label} className="grid min-h-12 grid-cols-[1rem_5rem_minmax(0,1fr)] items-center gap-2 py-2 text-sm">
              <span aria-hidden="true" className={hasRun ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}>
                {hasRun ? '✓' : '○'}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{label}</span>
              <span className="text-slate-600 dark:text-slate-300">{action}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <button type="button" onClick={() => setHasRun(true)} className="sales-button py-2 text-sm">
            Run demo
          </button>
          <p role="status" className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            {hasRun ? scenario.result : ''}
          </p>
        </div>
      </div>
    </section>
  );
}

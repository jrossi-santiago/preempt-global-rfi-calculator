'use client'

import { useState } from 'react'
import { CalculatorOutput, formatDollars } from '@/lib/calculator'
import { TOOLTIPS } from '@/lib/tooltips'

interface Props {
  output: CalculatorOutput
}

function Tooltip({ tooltipKey }: { tooltipKey: keyof typeof TOOLTIPS }) {
  const [open, setOpen] = useState(false)
  const tip = TOOLTIPS[tooltipKey]
  return (
    <span className="inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        className="tooltip-pill"
        aria-label="More information"
      >
        ?
      </button>
      {open && (
        <div className="tooltip-box mt-2">
          <div className="mb-1 font-sans text-xs font-semibold text-offwhite">
            {tip.title}
          </div>
          <div className="font-sans text-xs text-mist leading-relaxed">
            {tip.body}
          </div>
        </div>
      )}
    </span>
  )
}

function ReadinessGauge({ score }: { score: number }) {
  const radius = 54
  const circumference = Math.PI * radius
  const clampedScore = Math.max(0, Math.min(100, score))
  const offset = circumference * (1 - clampedScore / 100)

  const getScoreLabel = () => {
    if (score <= 40) return { label: 'High risk', color: '#E24B4A' }
    if (score <= 70) return { label: 'Moderate', color: '#D4A84B' }
    return { label: 'Maximum self-mitigation', color: '#B8832A' }
  }

  const { label, color } = getScoreLabel()

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs uppercase tracking-widest text-mist">
        Document readiness score
        <Tooltip tooltipKey="readinessScore" />
      </div>
      <svg
        width="140"
        height="85"
        viewBox="0 0 140 85"
        aria-label={`Readiness score: ${score} out of 100`}
      >
        {/* Track */}
        <path
          d="M 14 76 A 56 56 0 0 1 126 76"
          fill="none"
          stroke="#1C2B3A"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d="M 14 76 A 56 56 0 0 1 126 76"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${offset}`}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out, stroke 0.4s ease-out' }}
        />
        {/* Score number */}
        <text
          x="70"
          y="68"
          textAnchor="middle"
          fontSize="28"
          fontStyle="italic"
          fontFamily="Instrument Serif, Georgia, serif"
          fill="#D4A84B"
        >
          {clampedScore}
        </text>
      </svg>
      <div className="text-center">
        <div
          className="text-xs font-sans font-semibold"
          style={{ color }}
        >
          {label}
        </div>
        <div className="mt-1 text-xs text-mist opacity-60">
          0–40: High risk · 41–70: Moderate · 71–100: Max self-mitigation
        </div>
      </div>
    </div>
  )
}

export default function ResultDisplay({ output }: Props) {
  const [expandedDivision, setExpandedDivision] = useState<string | null>(null)

  return (
    <div className="space-y-6">

      {/* Main result grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Left — exposure numbers */}
        <div
          className="result-glow rounded-sm p-6 md:p-8"
          style={{ background: '#1C2B3A', borderTop: '1px solid #B8832A' }}
        >
          {/* Current exposure */}
          <div className="mb-6">
            <div className="mb-1 flex items-center gap-1 text-xs uppercase tracking-widest text-mist">
              Current change order exposure
              <Tooltip tooltipKey="exposureCurrent" />
            </div>
            <div
              className="font-serif text-3xl italic text-gold-light number-transition md:text-4xl"
            >
              {formatDollars(output.exposureLowCurrent)} – {formatDollars(output.exposureHighCurrent)}
            </div>
          </div>

          {/* Mitigated so far */}
          <div className="mb-4 border-t border-ink pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-mist">
                Mitigated so far
                <Tooltip tooltipKey="mitigatedSoFar" />
              </span>
              <span
                className="font-sans font-semibold text-gold-light number-transition"
              >
                {output.savingsLow > 0
                  ? `${formatDollars(output.savingsLow)} – ${formatDollars(output.savingsHigh)}`
                  : '$0'}
              </span>
            </div>
          </div>

          {/* Floor */}
          <div className="rounded-sm p-3" style={{ background: '#0C1117' }}>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-mist">
                Floor — requires outside review
                <Tooltip tooltipKey="floor" />
              </span>
              <span className="font-sans font-semibold text-gold number-transition">
                {formatDollars(output.exposureLowFloor)} – {formatDollars(output.exposureHighFloor)}
              </span>
            </div>
          </div>
        </div>

        {/* Right — gauge + RFI count */}
        <div className="flex flex-col gap-6">

          {/* Readiness gauge */}
          <div
            className="rounded-sm p-6"
            style={{ background: '#1C2B3A', borderTop: '1px solid #B8832A' }}
          >
            <ReadinessGauge score={output.readinessScore} />
          </div>

          {/* RFI count */}
          <div
            className="rounded-sm p-5"
            style={{ background: '#1C2B3A', borderTop: '1px solid #B8832A' }}
          >
            <div className="mb-1 flex items-center gap-1 text-xs uppercase tracking-widest text-mist">
              Estimated RFIs over project life
              <Tooltip tooltipKey="rfiCount" />
            </div>
            <div className="font-serif text-4xl italic text-gold-light number-transition">
              {output.rfiCount.toLocaleString()}
            </div>
          </div>

        </div>
      </div>

      {/* Base exposure — shown as reference */}
      <div
        className="rounded-sm p-5"
        style={{ background: '#1C2B3A', borderTop: '1px solid rgba(136,153,170,0.2)' }}
      >
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-1 text-xs text-mist">
            Base exposure (no mitigation applied)
            <Tooltip tooltipKey="exposureBase" />
          </div>
          <div className="font-sans text-sm font-semibold text-mist">
            {formatDollars(output.exposureLowBase)} – {formatDollars(output.exposureHighBase)}
          </div>
        </div>
      </div>

      {/* Top risk divisions */}
      <div
        className="rounded-sm p-5"
        style={{ background: '#1C2B3A', borderTop: '1px solid #B8832A' }}
      >
        <div className="mb-4 flex items-center gap-1 text-xs uppercase tracking-widest text-mist">
          Top risk areas for this project
          <Tooltip tooltipKey="topDivisions" />
        </div>
        <div className="space-y-2">
          {output.topDivisions.map(div => (
            <div key={div.code}>
              <button
                onClick={() =>
                  setExpandedDivision(
                    expandedDivision === div.code ? null : div.code
                  )
                }
                className="flex w-full items-center justify-between py-2 text-left border-b border-ink-2 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gold">
                    {div.code}
                  </span>
                  <span className="text-sm text-offwhite">{div.name}</span>
                </div>
                <span className="text-xs text-mist">
                  {expandedDivision === div.code ? '▲' : '▼'}
                </span>
              </button>
              {expandedDivision === div.code && (
                <div className="pb-3 pt-2 text-xs leading-relaxed text-mist animate-fade-in">
                  {div.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

'use client'

import { useState } from 'react'
import { CalculatorOutput } from '@/lib/calculator'
import { MITIGATION_FACTORS } from '@/lib/constants'
import { ProjectType } from '@/lib/calculator'
import findingsData from '@/lib/findings.json'

interface Finding {
  id: string
  division: string
  category: string
  mitigationFactor: string
  finding: string
  howItGotThere: string
  consequence: string
  costRangeLow: number
  costRangeHigh: number
  tags: string[]
}

interface Props {
  output: CalculatorOutput
  selectedIds: string[]
  projectType: ProjectType
  onMitigationChange: (ids: string[]) => void
}

const findings = findingsData as Finding[]

function formatCost(low: number, high: number): string {
  function fmt(n: number) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
    return `$${n.toLocaleString()}`
  }
  return `${fmt(low)} – ${fmt(high)}`
}

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <div
      className="rounded-sm p-4 mt-3"
      style={{ background: '#0C1117', border: '0.5px solid rgba(136,153,170,0.15)' }}
    >
      <div className="mb-2 text-xs font-semibold text-gold">
        {finding.division}
      </div>
      <div className="mb-2 text-xs leading-relaxed text-mist">
        {finding.finding}
      </div>
      <div className="mb-1 text-xs text-mist opacity-70 italic">
        How it happens: {finding.howItGotThere}
      </div>
      <div
        className="mt-2 inline-block rounded-sm px-2 py-1 text-xs font-semibold"
        style={{ background: 'rgba(184,131,42,0.12)', color: '#D4A84B' }}
      >
        If not caught: {formatCost(finding.costRangeLow, finding.costRangeHigh)} change order
      </div>
    </div>
  )
}

function MitigationCard({
  factor,
  isOn,
  onToggle,
}: {
  factor: typeof MITIGATION_FACTORS[0]
  isOn: boolean
  onToggle: () => void
}) {
  const [showFindings, setShowFindings] = useState(false)
  const [findingIndex, setFindingIndex] = useState(0)

  const matchingFindings = findings.filter(
    f => f.mitigationFactor === factor.id
  )

  const reductionPercent = Math.round(factor.reduction * 100)

  function handleToggle() {
    onToggle()
    if (!isOn) {
      setShowFindings(true)
      setFindingIndex(0)
    }
  }

  function showNext() {
    setFindingIndex(i => (i + 1) % matchingFindings.length)
  }

  return (
    <div
      className="rounded-sm p-5 transition-all duration-200"
      style={{
        background: '#1C2B3A',
        borderTop: isOn
          ? '1px solid #B8832A'
          : '1px solid rgba(136,153,170,0.2)',
      }}
    >
      {/* Card header row */}
      <div className="flex items-start gap-4">

        {/* Toggle */}
        <button
          onClick={handleToggle}
          className={`toggle-track mt-0.5 ${isOn ? 'on' : 'off'}`}
          aria-pressed={isOn}
          aria-label={`Toggle ${factor.label}`}
        >
          <div className="toggle-thumb" />
        </button>

        {/* Text */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div
              className="font-serif text-base italic"
              style={{ color: isOn ? '#F7F5F0' : '#8899AA' }}
            >
              {factor.label}
            </div>
            <div
              className="flex-shrink-0 rounded-sm px-2 py-0.5 text-xs font-semibold"
              style={{
                background: isOn
                  ? 'rgba(184,131,42,0.15)'
                  : 'rgba(136,153,170,0.1)',
                color: isOn ? '#D4A84B' : '#8899AA',
              }}
            >
              –{reductionPercent}%
            </div>
          </div>
          <div className="mt-1 text-xs leading-relaxed text-mist">
            {factor.description}
          </div>
        </div>

      </div>

      {/* Findings expander */}
      {matchingFindings.length > 0 && (
        <div className="mt-4 ml-12">
          <button
            onClick={() => {
              setShowFindings(v => !v)
              setFindingIndex(0)
            }}
            className="text-xs text-gold hover:text-gold-light transition-colors"
          >
            {showFindings ? 'hide example ↑' : 'see an example →'}
          </button>

          {showFindings && (
            <div className="animate-fade-in">
              <FindingCard finding={matchingFindings[findingIndex]} />
              {matchingFindings.length > 1 && (
                <button
                  onClick={showNext}
                  className="mt-2 text-xs text-mist hover:text-gold transition-colors"
                >
                  show another ({findingIndex + 1} of {matchingFindings.length}) →
                </button>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default function MitigationPanel({
  output,
  selectedIds,
  onMitigationChange,
}: Props) {

  function handleToggle(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id]
    onMitigationChange(next)
  }

  const totalReduction = Math.round(output.mitigationApplied * 100)
  const atCap = output.mitigationApplied >= 0.60

  return (
    <div className="space-y-4">

      {/* Progress bar */}
      <div
        className="rounded-sm p-4"
        style={{ background: '#1C2B3A', borderTop: '1px solid rgba(136,153,170,0.2)' }}
      >
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-mist">Total mitigation applied</span>
          <span className="font-semibold text-gold-light">
            {totalReduction}% {atCap && '(floor reached)'}
          </span>
        </div>
        <div
          className="h-1.5 w-full rounded-full"
          style={{ background: '#0C1117' }}
        >
          <div
            className="h-1.5 rounded-full"
            style={{
              width: `${Math.min(totalReduction, 60)}%`,
              background: atCap ? '#D4A84B' : '#B8832A',
              transition: 'width 0.6s ease-out',
              maxWidth: '60%',
            }}
          />
        </div>
        <div className="mt-1 text-right text-xs text-mist opacity-50">
          60% maximum self-mitigation
        </div>
      </div>

      {/* Mitigation factor cards */}
      {MITIGATION_FACTORS.map(factor => (
        <MitigationCard
          key={factor.id}
          factor={factor}
          isOn={selectedIds.includes(factor.id)}
          onToggle={() => handleToggle(factor.id)}
        />
      ))}

      {/* Cap notice */}
      {atCap && (
        <div
          className="rounded-sm p-4 animate-fade-in text-center"
          style={{ background: 'rgba(212,168,75,0.08)', border: '1px solid rgba(212,168,75,0.25)' }}
        >
          <div className="text-xs text-gold-light">
            You've applied the maximum self-mitigation. The floor section below shows what remains.
          </div>
        </div>
      )}

    </div>
  )
}

'use client'

import { useState } from 'react'
import { CalculatorOutput, CalculatorInput, formatDollars } from '@/lib/calculator'
import {
  PROJECT_TYPE_LABELS,
  DOC_PHASE_LABELS,
  DELIVERY_METHOD_LABELS,
  SCHEDULE_PRESSURE_LABELS,
  COORDINATION_COMPLEXITY_LABELS,
} from '@/lib/constants'

interface Props {
  output: CalculatorOutput
  input: CalculatorInput
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function EmailCapture({ output, input }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [formVisible, setFormVisible] = useState(false)

  function validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  async function handleSubmit() {
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }
    setErrorMessage('')
    setStatus('loading')

    try {
      const payload = {
        email,
        projectValue: input.projectValue,
        projectType: PROJECT_TYPE_LABELS[input.projectType],
        docPhase: DOC_PHASE_LABELS[input.docPhase],
        deliveryMethod: DELIVERY_METHOD_LABELS[input.deliveryMethod],
        schedulePressure: SCHEDULE_PRESSURE_LABELS[input.schedulePressure],
        coordinationComplexity: COORDINATION_COMPLEXITY_LABELS[input.coordinationComplexity],
        mitigationFactorIds: input.mitigationFactorIds,
        exposureLowBase: output.exposureLowBase,
        exposureHighBase: output.exposureHighBase,
        exposureLowCurrent: output.exposureLowCurrent,
        exposureHighCurrent: output.exposureHighCurrent,
        exposureLowFloor: output.exposureLowFloor,
        exposureHighFloor: output.exposureHighFloor,
        savingsLow: output.savingsLow,
        savingsHigh: output.savingsHigh,
        residualLow: output.residualLow,
        residualHigh: output.residualHigh,
        readinessScore: output.readinessScore,
        rfiCount: output.rfiCount,
        topDivisions: output.topDivisions,
      }

      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong.')
      }

      setStatus('success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setErrorMessage(message)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="rounded-sm p-6 text-center animate-fade-in"
        style={{ background: 'rgba(184,131,42,0.08)', border: '1px solid rgba(184,131,42,0.25)' }}
      >
        <div className="mb-2 font-serif text-xl italic text-gold-light">
          Sent.
        </div>
        <div className="text-sm text-mist">
          Check your inbox. The report includes your full calculation, the methodology, and the most common findings on projects like yours.
        </div>
      </div>
    )
  }

  return (
    <div>
      {!formVisible ? (
        <button
          onClick={() => setFormVisible(true)}
          className="btn-primary"
        >
          Get the full residual exposure report →
        </button>
      ) : (
        <div className="animate-fade-in space-y-4">

          {/* Summary of what they'll get */}
          <div
            className="rounded-sm p-4 text-xs text-mist leading-relaxed"
            style={{ background: 'rgba(12,17,23,0.6)', border: '0.5px solid rgba(136,153,170,0.15)' }}
          >
            We'll send a branded PDF to your inbox with your full calculation, the methodology behind every number, and the most common findings on{' '}
            <span className="text-offwhite">
              {PROJECT_TYPE_LABELS[input.projectType].toLowerCase()}
            </span>{' '}
            projects like yours. Your residual exposure:{' '}
            <span className="font-semibold text-gold-light">
              {formatDollars(output.residualLow)} – {formatDollars(output.residualHigh)}
            </span>
            .
          </div>

          {/* Email input row */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="your@email.com"
              className="form-input flex-1"
              disabled={status === 'loading'}
            />
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="btn-primary flex-shrink-0"
              style={{
                opacity: status === 'loading' ? 0.7 : 1,
                cursor: status === 'loading' ? 'wait' : 'pointer',
              }}
            >
              {status === 'loading' ? 'Sending…' : 'Send me the report'}
            </button>
          </div>

          {errorMessage && (
            <p className="text-xs text-red-400">{errorMessage}</p>
          )}

          <p className="text-xs text-mist opacity-50">
            No spam. One email. Your data stays with Preempt Global.
          </p>

        </div>
      )}
    </div>
  )
}

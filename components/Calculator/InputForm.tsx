'use client'

import { useState } from 'react'
import { CalculatorInput, ProjectType, DocPhase, DeliveryMethod, SchedulePressure, CoordinationComplexity } from '@/lib/calculator'

interface Props {
  defaultInput: CalculatorInput
  onCalculate: (input: CalculatorInput) => void
}

export default function InputForm({ defaultInput, onCalculate }: Props) {
  const [projectValue, setProjectValue] = useState<string>('40000000')
  const [projectType, setProjectType] = useState<ProjectType>(defaultInput.projectType)
  const [docPhase, setDocPhase] = useState<DocPhase>(defaultInput.docPhase)
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(defaultInput.deliveryMethod)
  const [schedulePressure, setSchedulePressure] = useState<SchedulePressure>(defaultInput.schedulePressure)
  const [coordinationComplexity, setCoordinationComplexity] = useState<CoordinationComplexity>(defaultInput.coordinationComplexity)
  const [error, setError] = useState<string>('')

  function handleSubmit() {
    const value = parseFloat(projectValue.replace(/[^0-9.]/g, ''))
    if (isNaN(value) || value < 1_000_000) {
      setError('Project value must be at least $1,000,000.')
      return
    }
    if (value > 1_000_000_000) {
      setError('Project value must be $1,000,000,000 or less.')
      return
    }
    setError('')
    onCalculate({
      projectValue: value,
      projectType,
      docPhase,
      deliveryMethod,
      schedulePressure,
      coordinationComplexity,
      mitigationFactorIds: [],
    })
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Project value */}
        <div>
          <label className="mb-1 block text-sm text-offwhite">
            Project value
          </label>
          <p className="mb-2 text-xs text-mist">Total construction cost estimate in dollars.</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mist text-sm">$</span>
            <input
              type="number"
              min="1000000"
              max="1000000000"
              value={projectValue}
              onChange={e => setProjectValue(e.target.value)}
              className="form-input pl-7"
              placeholder="40000000"
            />
          </div>
        </div>

        {/* Project type */}
        <div>
          <label className="mb-1 block text-sm text-offwhite">
            Project type
          </label>
          <p className="mb-2 text-xs text-mist">What kind of building is this?</p>
          <div className="select-wrap">
            <select
              value={projectType}
              onChange={e => setProjectType(e.target.value as ProjectType)}
              className="form-input"
            >
              <option value="data_center">Data center</option>
              <option value="large_commercial">Large commercial</option>
              <option value="industrial">Industrial</option>
              <option value="healthcare">Healthcare</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Document phase */}
        <div>
          <label className="mb-1 block text-sm text-offwhite">
            Document phase
          </label>
          <p className="mb-2 text-xs text-mist">Where are your construction documents right now?</p>
          <div className="select-wrap">
            <select
              value={docPhase}
              onChange={e => setDocPhase(e.target.value as DocPhase)}
              className="form-input"
            >
              <option value="schematic">Schematic Design</option>
              <option value="dd">Design Development</option>
              <option value="cd_progress">CDs in progress</option>
              <option value="cd_issued">CDs issued for bid</option>
              <option value="out_to_bid">Out to bid</option>
            </select>
          </div>
        </div>

        {/* Delivery method */}
        <div>
          <label className="mb-1 block text-sm text-offwhite">
            Delivery method
          </label>
          <p className="mb-2 text-xs text-mist">How is this project contracted and structured?</p>
          <div className="select-wrap">
            <select
              value={deliveryMethod}
              onChange={e => setDeliveryMethod(e.target.value as DeliveryMethod)}
              className="form-input"
            >
              <option value="dbb">Design-Bid-Build</option>
              <option value="cmar">CM at Risk</option>
              <option value="db">Design-Build</option>
              <option value="ipd">IPD</option>
            </select>
          </div>
        </div>

        {/* Schedule pressure */}
        <div>
          <label className="mb-1 block text-sm text-offwhite">
            Schedule pressure
          </label>
          <p className="mb-2 text-xs text-mist">How compressed is the timeline from design to bid to construction?</p>
          <div className="select-wrap">
            <select
              value={schedulePressure}
              onChange={e => setSchedulePressure(e.target.value as SchedulePressure)}
              className="form-input"
            >
              <option value="standard">Standard</option>
              <option value="fast_track">Fast-track</option>
              <option value="extreme_fast_track">Extreme fast-track</option>
            </select>
          </div>
        </div>

        {/* Coordination complexity */}
        <div>
          <label className="mb-1 block text-sm text-offwhite">
            Coordination complexity
          </label>
          <p className="mb-2 text-xs text-mist">How many consultants are on this project?</p>
          <div className="select-wrap">
            <select
              value={coordinationComplexity}
              onChange={e => setCoordinationComplexity(e.target.value as CoordinationComplexity)}
              className="form-input"
            >
              <option value="low">Low (1–3 consultants)</option>
              <option value="medium">Medium (4–7 consultants)</option>
              <option value="high">High (8+ consultants)</option>
            </select>
          </div>
        </div>

      </div>

      {error && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        className="btn-primary mt-8"
      >
        Calculate exposure →
      </button>
    </div>
  )
}

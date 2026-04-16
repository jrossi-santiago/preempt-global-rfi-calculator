import {
  BASE_RFI_PER_MILLION,
  BASE_EXPOSURE_PERCENT_LOW,
  BASE_EXPOSURE_PERCENT_HIGH,
  PROJECT_TYPE_MULTIPLIERS,
  DOC_PHASE_MULTIPLIERS,
  DELIVERY_METHOD_MULTIPLIERS,
  SCHEDULE_PRESSURE_MULTIPLIERS,
  COORDINATION_COMPLEXITY_MULTIPLIERS,
  MITIGATION_FACTORS,
  MAX_MITIGATION,
  TOP_DIVISIONS_BY_TYPE,
} from './constants'

export type ProjectType = 'data_center' | 'large_commercial' | 'industrial' | 'healthcare' | 'other'
export type DocPhase = 'schematic' | 'dd' | 'cd_progress' | 'cd_issued' | 'out_to_bid'
export type DeliveryMethod = 'dbb' | 'cmar' | 'db' | 'ipd'
export type SchedulePressure = 'standard' | 'fast_track' | 'extreme_fast_track'
export type CoordinationComplexity = 'low' | 'medium' | 'high'

export interface Division {
  code: string
  name: string
  reason: string
}

export interface CalculatorInput {
  projectValue: number
  projectType: ProjectType
  docPhase: DocPhase
  deliveryMethod: DeliveryMethod
  schedulePressure: SchedulePressure
  coordinationComplexity: CoordinationComplexity
  mitigationFactorIds: string[]
}

export interface CalculatorOutput {
  rfiCount: number
  exposureLowBase: number
  exposureHighBase: number
  exposureLowCurrent: number
  exposureHighCurrent: number
  exposureLowFloor: number
  exposureHighFloor: number
  savingsLow: number
  savingsHigh: number
  residualLow: number
  residualHigh: number
  readinessScore: number
  topDivisions: Division[]
  mitigationApplied: number
  atFloor: boolean
}

export function formatDollars(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    const rounded = Math.round(millions * 100) / 100
    return `$${rounded}M`
  }
  if (value >= 1_000) {
    const thousands = value / 1_000
    const rounded = Math.round(thousands * 10) / 10
    return `$${rounded}K`
  }
  return `$${Math.round(value).toLocaleString()}`
}

export function formatDollarsRange(low: number, high: number): string {
  return `${formatDollars(low)} – ${formatDollars(high)}`
}

export function calculate(input: CalculatorInput): CalculatorOutput {
  const typeMult = PROJECT_TYPE_MULTIPLIERS[input.projectType]
  const phaseMult = DOC_PHASE_MULTIPLIERS[input.docPhase]
  const deliveryMult = DELIVERY_METHOD_MULTIPLIERS[input.deliveryMethod]
  const scheduleMult = SCHEDULE_PRESSURE_MULTIPLIERS[input.schedulePressure]
  const coordMult = COORDINATION_COMPLEXITY_MULTIPLIERS[input.coordinationComplexity]

  // 1. RFI count
  const baseRfi = (input.projectValue / 1_000_000) * BASE_RFI_PER_MILLION
  const rfiCount = Math.round(
    baseRfi * typeMult.rfi * phaseMult * deliveryMult * scheduleMult * coordMult
  )

  // 2. Base exposure range (before any mitigation)
  const exposureLowBase =
    input.projectValue *
    BASE_EXPOSURE_PERCENT_LOW *
    typeMult.exposure_low *
    phaseMult *
    deliveryMult *
    scheduleMult *
    coordMult

  const exposureHighBase =
    input.projectValue *
    BASE_EXPOSURE_PERCENT_HIGH *
    typeMult.exposure_high *
    phaseMult *
    deliveryMult *
    scheduleMult *
    coordMult

  // 3. Mitigation reduction — sum of selected factors, capped at MAX_MITIGATION
  const selectedFactors = MITIGATION_FACTORS.filter(f =>
    input.mitigationFactorIds.includes(f.id)
  )
  const rawReduction = selectedFactors.reduce((sum, f) => sum + f.reduction, 0)
  const mitigationApplied = Math.min(rawReduction, MAX_MITIGATION)

  // 4. Current exposure (after user's selected mitigation)
  const exposureLowCurrent = exposureLowBase * (1 - mitigationApplied)
  const exposureHighCurrent = exposureHighBase * (1 - mitigationApplied)

  // 5. Floor — what remains even at maximum mitigation
  const exposureLowFloor = exposureLowBase * (1 - MAX_MITIGATION)
  const exposureHighFloor = exposureHighBase * (1 - MAX_MITIGATION)

  // 6. Savings = base minus current
  const savingsLow = exposureLowBase - exposureLowCurrent
  const savingsHigh = exposureHighBase - exposureHighCurrent

  // 7. Residual = floor (what Preempt addresses)
  const residualLow = exposureLowFloor
  const residualHigh = exposureHighFloor

  // 8. Readiness score 0–100
  const readinessScore = Math.round((mitigationApplied / MAX_MITIGATION) * 100)

  // 9. Top divisions for this project type
  const topDivisions = TOP_DIVISIONS_BY_TYPE[input.projectType]

  // 10. Whether user has hit the mitigation floor
  const atFloor = mitigationApplied >= MAX_MITIGATION

  return {
    rfiCount,
    exposureLowBase,
    exposureHighBase,
    exposureLowCurrent,
    exposureHighCurrent,
    exposureLowFloor,
    exposureHighFloor,
    savingsLow,
    savingsHigh,
    residualLow,
    residualHigh,
    readinessScore,
    topDivisions,
    mitigationApplied,
    atFloor,
  }
}

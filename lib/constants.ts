export const BASE_RFI_PER_MILLION = 10

export const PROJECT_TYPE_MULTIPLIERS = {
  data_center: { rfi: 1.4, exposure_low: 1.0, exposure_high: 1.2 },
  large_commercial: { rfi: 1.0, exposure_low: 1.0, exposure_high: 1.0 },
  industrial: { rfi: 1.1, exposure_low: 1.0, exposure_high: 1.05 },
  healthcare: { rfi: 1.5, exposure_low: 1.1, exposure_high: 1.3 },
  other: { rfi: 1.0, exposure_low: 1.0, exposure_high: 1.0 },
}

export const DOC_PHASE_MULTIPLIERS = {
  schematic: 0.4,
  dd: 0.6,
  cd_progress: 0.8,
  cd_issued: 1.0,
  out_to_bid: 1.1,
}

export const DELIVERY_METHOD_MULTIPLIERS = {
  dbb: 1.2,
  cmar: 1.0,
  db: 0.85,
  ipd: 0.75,
}

export const SCHEDULE_PRESSURE_MULTIPLIERS = {
  standard: 1.0,
  fast_track: 1.25,
  extreme_fast_track: 1.5,
}

export const COORDINATION_COMPLEXITY_MULTIPLIERS = {
  low: 0.9,
  medium: 1.0,
  high: 1.2,
}

export const BASE_EXPOSURE_PERCENT_LOW = 0.05
export const BASE_EXPOSURE_PERCENT_HIGH = 0.10

export const MITIGATION_FACTORS = [
  {
    id: 'spec_drawing_reconciliation',
    label: 'Spec-to-drawing reconciliation',
    description: 'An outside reviewer cross-walks every specification section against the drawings it references, flagging conflicts before bid.',
    reduction: 0.15,
  },
  {
    id: 'mep_coordination',
    label: 'MEP coordination review',
    description: 'A documented clash resolution process across electrical, mechanical, plumbing, and low voltage with sign-off from each discipline.',
    reduction: 0.18,
  },
  {
    id: 'spec_completeness',
    label: 'Specification completeness review',
    description: 'A full read of every specification section checking for missing scopes, unassigned responsibilities, and template language that was never project-specific.',
    reduction: 0.14,
  },
  {
    id: 'div01_review',
    label: 'Division 01 general requirements review',
    description: 'A reconciliation of the front-end contract against Division 01 covering alternates, allowances, submittals, and scope boundaries.',
    reduction: 0.08,
  },
  {
    id: 'arch_coordination',
    label: 'Architectural coordination review',
    description: 'Wall types, finishes, hardware, and fire ratings checked against each other and against the acoustic and life safety requirements.',
    reduction: 0.06,
  },
  {
    id: 'bod_verification',
    label: 'Basis of Design verification',
    description: 'Every performance target in the BOD checked against the equipment schedules and load calculations that should reflect it.',
    reduction: 0.10,
  },
  {
    id: 'addenda_reconciliation',
    label: 'Addenda reconciliation',
    description: 'Every addendum issued during bidding tracked against the final bid set so nothing gets lost between revisions.',
    reduction: 0.05,
  },
  {
    id: 'code_review',
    label: 'Independent code compliance review',
    description: 'A separate pass for code compliance issues — seismic, fire, energy — not relying on the original design team to check their own work.',
    reduction: 0.04,
  },
]

export const MAX_MITIGATION = 0.60

export const TOP_DIVISIONS_BY_TYPE: Record<string, { code: string; name: string; reason: string }[]> = {
  data_center: [
    { code: 'Div. 26', name: 'Electrical', reason: 'Spec density, load coordination, and the volume of specialty systems drive the highest RFI volume on data center builds.' },
    { code: 'Div. 23', name: 'Mechanical', reason: 'Cooling redundancy, clearance requirements, and controls integration create coordination gaps that compound through commissioning.' },
    { code: 'Div. 28', name: 'Low Voltage', reason: 'Access control, fire alarm, and structured cabling scopes routinely fall between disciplines — the gaps get priced as allowances.' },
  ],
  large_commercial: [
    { code: 'Div. 23', name: 'Mechanical', reason: 'System sizing, ductwork coordination, and BAS integration are the highest-volume RFI sources on commercial builds.' },
    { code: 'Div. 08', name: 'Openings', reason: 'Hardware schedules and fire rating coordination routinely conflict across documents.' },
    { code: 'Div. 09', name: 'Finishes', reason: 'Room finish schedule versus plan discrepancies are the single most common CD conflict on commercial projects.' },
  ],
  industrial: [
    { code: 'Div. 26', name: 'Electrical', reason: 'Heavy power distribution and process equipment coordination drive the majority of RFI volume.' },
    { code: 'Div. 23', name: 'Mechanical', reason: 'Process cooling and ventilation scopes routinely lack documented performance basis.' },
    { code: 'Div. 22', name: 'Plumbing', reason: 'Process piping and containment requirements often reference standards without project-specific details.' },
  ],
  healthcare: [
    { code: 'Div. 22', name: 'Plumbing', reason: 'Medical gas systems carry the highest code compliance risk and the most detailed submittal requirements.' },
    { code: 'Div. 26', name: 'Electrical', reason: 'Essential electrical systems per NFPA 99 create complex scope boundaries that routinely go undefined.' },
    { code: 'Div. 23', name: 'Mechanical', reason: 'Infection control and pressure relationships drive the highest coordination complexity in any building type.' },
  ],
  other: [
    { code: 'Div. 26', name: 'Electrical', reason: 'Electrical scope is the most common source of RFIs across all building types.' },
    { code: 'Div. 23', name: 'Mechanical', reason: 'Mechanical coordination gaps are the second most common source of change orders.' },
    { code: 'Div. 09', name: 'Finishes', reason: 'Finish conflicts are the most common architectural issue across building types.' },
  ],
}

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  data_center: 'Data center',
  large_commercial: 'Large commercial',
  industrial: 'Industrial',
  healthcare: 'Healthcare',
  other: 'Other',
}

export const DOC_PHASE_LABELS: Record<string, string> = {
  schematic: 'Schematic Design',
  dd: 'Design Development',
  cd_progress: 'CDs in progress',
  cd_issued: 'CDs issued for bid',
  out_to_bid: 'Out to bid',
}

export const DELIVERY_METHOD_LABELS: Record<string, string> = {
  dbb: 'Design-Bid-Build',
  cmar: 'CM at Risk',
  db: 'Design-Build',
  ipd: 'IPD',
}

export const SCHEDULE_PRESSURE_LABELS: Record<string, string> = {
  standard: 'Standard',
  fast_track: 'Fast-track',
  extreme_fast_track: 'Extreme fast-track',
}

export const COORDINATION_COMPLEXITY_LABELS: Record<string, string> = {
  low: 'Low (1–3 consultants)',
  medium: 'Medium (4–7 consultants)',
  high: 'High (8+ consultants)',
}

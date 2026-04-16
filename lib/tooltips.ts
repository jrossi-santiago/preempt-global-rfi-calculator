export const TOOLTIPS = {
  rfiCount: {
    title: 'Why this many RFIs?',
    body: 'Industry research places average RFI volume at roughly 10 per $1M of construction value on standard commercial projects. Your project type, schedule pressure, delivery method, and coordination complexity each apply a multiplier on top of that baseline. Data center and healthcare projects run significantly higher than the average because of specialty system density and the number of disciplines that have to coordinate.',
  },
  exposureBase: {
    title: 'Where does this range come from?',
    body: 'Published industry research (CII, FMI) places typical change order rates at 5–10% of construction value on commercial projects. Your project type, delivery method, schedule pressure, and coordination complexity each shift that range up or down. The low end assumes favorable conditions within those factors. The high end reflects the realistic worst case given your inputs.',
  },
  exposureCurrent: {
    title: 'What does this number mean?',
    body: 'This is your estimated change order exposure after accounting for the document-quality practices you\'ve toggled on. Each practice you\'ve done reduces the number — but only up to the floor, which represents the residual risk that requires an outside pre-bid review to address.',
  },
  floor: {
    title: 'Why is there a floor?',
    body: 'A design team cannot fully review its own documents the way a contractor will. No matter how many internal quality control practices are in place, a percentage of the risk requires an independent read before bid. That percentage — roughly 40% of the total exposure on most projects — is what we call residual risk. The floor is fixed. It does not move regardless of how many mitigation factors are toggled on.',
  },
  mitigatedSoFar: {
    title: 'What does mitigated mean?',
    body: 'This is the dollar difference between your base exposure (no mitigation) and your current exposure (with the practices you\'ve toggled on). It represents the risk your team has already addressed through document quality work. The remaining exposure — everything below the floor — requires an outside read to close.',
  },
  readinessScore: {
    title: 'What is a readiness score?',
    body: 'The readiness score measures how much of the self-mitigatable risk your team has addressed, expressed as a number from 0 to 100. A score of 100 means you\'ve applied every available document-quality practice — but it does not mean your exposure is zero. The floor remains regardless of score. Think of it as a measure of your team\'s preparation, not a measure of safety.',
  },
  residualExposure: {
    title: 'What is residual exposure?',
    body: 'Residual exposure is the change order risk that remains after all possible self-mitigation has been applied. It cannot be reduced by internal document quality practices because it requires reading the documents the way a contractor will — which is something the design team cannot do by definition. This is the specific gap that a pre-bid document review closes.',
  },
  topDivisions: {
    title: 'Why these divisions?',
    body: 'RFI volume and change order exposure are not evenly distributed across all specification divisions. These three divisions consistently produce the highest volume of document-based conflicts for your project type, based on Preempt Global\'s review of pre-construction findings across data center and large commercial projects.',
  },
  deliveryMethod: {
    title: 'Why does delivery method matter?',
    body: 'Delivery method determines who holds the coordination risk. Design-Bid-Build separates design from construction entirely, which means document conflicts are discovered by the contractor — after bid. Design-Build and IPD shift some of that risk earlier in the process, which is why they carry lower multipliers.',
  },
  schedulePressure: {
    title: 'Why does schedule pressure matter?',
    body: 'Fast-track and extreme fast-track schedules compress the time available for coordination between disciplines. Drawings that would have been reconciled in a normal schedule go to bid with unresolved conflicts. The faster the schedule, the higher the probability that document gaps reach the contractor.',
  },
  docPhase: {
    title: 'Why does document phase matter?',
    body: 'The further along your documents are, the more concrete the risk picture becomes. Schematic design documents carry low multipliers because everything is still fluid. Documents out to bid carry the highest multipliers because every conflict in those documents will be discovered by a contractor pricing real work.',
  },
  coordinationComplexity: {
    title: 'Why does consultant count matter?',
    body: 'Every additional consultant adds another document set that has to be coordinated against every other document set. At 8+ consultants, the number of possible conflicts grows exponentially. Low complexity projects have fewer interfaces to check. High complexity projects have more places for things to fall through the cracks.',
  },
}

export type TooltipKey = keyof typeof TOOLTIPS

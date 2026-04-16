import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import findingsData from '@/lib/findings.json'
import { MITIGATION_FACTORS } from '@/lib/constants'

interface Division {
  code: string
  name: string
  reason: string
}

interface ReportPDFProps {
  email: string
  projectValue: number
  projectType: string
  docPhase: string
  deliveryMethod: string
  schedulePressure: string
  coordinationComplexity: string
  mitigationFactorIds: string[]
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
  rfiCount: number
  topDivisions: Division[]
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${Math.round(n).toLocaleString()}`
}

function fmtDollars(n: number): string {
  return `$${Math.round(n).toLocaleString()}`
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0C1117',
    color: '#F7F5F0',
    fontFamily: 'Helvetica',
    padding: 48,
  },
  pageLight: {
    backgroundColor: '#F7F5F0',
    color: '#0C1117',
    fontFamily: 'Helvetica',
    padding: 48,
  },
  goldBar: {
    height: 3,
    backgroundColor: '#B8832A',
    marginBottom: 36,
  },
  logo: {
    fontSize: 9,
    color: '#B8832A',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 48,
  },
  coverHeadline: {
    fontSize: 28,
    color: '#F7F5F0',
    marginBottom: 16,
    lineHeight: 1.3,
  },
  coverSub: {
    fontSize: 11,
    color: '#8899AA',
    marginBottom: 48,
    lineHeight: 1.6,
  },
  coverStatRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  coverStat: {
    flex: 1,
    backgroundColor: '#1C2B3A',
    borderTopWidth: 1,
    borderTopColor: '#B8832A',
    padding: 14,
  },
  coverStatLabel: {
    fontSize: 8,
    color: '#8899AA',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  coverStatValue: {
    fontSize: 18,
    color: '#D4A84B',
  },
  coverFooter: {
    position: 'absolute',
    bottom: 48,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: '#1C2B3A',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coverFooterText: {
    fontSize: 8,
    color: '#8899AA',
  },
  sectionLabel: {
    fontSize: 8,
    color: '#B8832A',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionHeadline: {
    fontSize: 18,
    color: '#0C1117',
    marginBottom: 16,
    lineHeight: 1.3,
  },
  sectionHeadlineDark: {
    fontSize: 18,
    color: '#F7F5F0',
    marginBottom: 16,
    lineHeight: 1.3,
  },
  bodyText: {
    fontSize: 10,
    color: '#444',
    lineHeight: 1.7,
    marginBottom: 12,
  },
  bodyTextDark: {
    fontSize: 10,
    color: '#8899AA',
    lineHeight: 1.7,
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  dataRowDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1C2B3A',
    paddingVertical: 8,
  },
  dataLabel: {
    fontSize: 9,
    color: '#888',
  },
  dataLabelDark: {
    fontSize: 9,
    color: '#8899AA',
  },
  dataValue: {
    fontSize: 9,
    color: '#0C1117',
    fontFamily: 'Helvetica-Bold',
  },
  dataValueDark: {
    fontSize: 9,
    color: '#F7F5F0',
    fontFamily: 'Helvetica-Bold',
  },
  bigNumber: {
    fontSize: 28,
    color: '#D4A84B',
    marginBottom: 4,
  },
  bigNumberLabel: {
    fontSize: 8,
    color: '#8899AA',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#B8832A',
    padding: 14,
    marginBottom: 10,
  },
  cardDark: {
    backgroundColor: '#1C2B3A',
    borderTopWidth: 1,
    borderTopColor: '#B8832A',
    padding: 14,
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 8,
    color: '#B8832A',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 9,
    color: '#444',
    lineHeight: 1.6,
  },
  cardTextDark: {
    fontSize: 9,
    color: '#8899AA',
    lineHeight: 1.6,
  },
  costBadge: {
    backgroundColor: '#FFF8EC',
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  costBadgeText: {
    fontSize: 8,
    color: '#B8832A',
    fontFamily: 'Helvetica-Bold',
  },
  pageFooter: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pageFooterText: {
    fontSize: 7,
    color: '#8899AA',
  },
  divisionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  divisionCode: {
    fontSize: 8,
    color: '#B8832A',
    fontFamily: 'Helvetica-Bold',
    width: 50,
    marginTop: 1,
  },
  divisionText: {
    fontSize: 9,
    color: '#8899AA',
    flex: 1,
    lineHeight: 1.5,
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1C2B3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 22,
    color: '#D4A84B',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 16,
  },
  col: {
    flex: 1,
  },
})

function PageFooter({ page, total }: { page: number; total: number }) {
  return (
    <View style={styles.pageFooter} fixed>
      <Text style={styles.pageFooterText}>Preempt Global — Confidential</Text>
      <Text style={styles.pageFooterText}>Page {page} of {total}</Text>
    </View>
  )
}

export function ReportPDF(props: ReportPDFProps) {
  const {
    projectValue,
    projectType,
    docPhase,
    deliveryMethod,
    schedulePressure,
    coordinationComplexity,
    mitigationFactorIds,
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
    rfiCount,
    topDivisions,
  } = props

  const selectedFactors = MITIGATION_FACTORS.filter(f =>
    mitigationFactorIds.includes(f.id)
  )

  const relevantFindings = findingsData
    .filter(f => mitigationFactorIds.includes(f.mitigationFactor))
    .slice(0, 5)

  const allTopFindings = findingsData
    .filter(f =>
      topDivisions.some(d =>
        f.division.toLowerCase().includes(d.name.toLowerCase())
      )
    )
    .slice(0, 5)

  const displayFindings = relevantFindings.length > 0 ? relevantFindings : allTopFindings

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Document
      title="Preempt Global — RFI Exposure Report"
      author="Preempt Global LLC"
      subject="Pre-bid document review exposure estimate"
    >

      {/* Page 1 — Cover */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.goldBar} />
        <Text style={styles.logo}>Preempt Global</Text>
        <Text style={styles.coverHeadline}>
          RFI Exposure Report
        </Text>
        <Text style={styles.coverSub}>
          Prepared {today}. This report reflects the document-quality inputs you provided and the estimated change order exposure for your project based on Preempt Global's findings methodology.
        </Text>

        <View style={styles.coverStatRow}>
          <View style={styles.coverStat}>
            <Text style={styles.coverStatLabel}>Base exposure</Text>
            <Text style={styles.coverStatValue}>
              {fmt(exposureLowBase)} – {fmt(exposureHighBase)}
            </Text>
          </View>
          <View style={styles.coverStat}>
            <Text style={styles.coverStatLabel}>Residual exposure</Text>
            <Text style={styles.coverStatValue}>
              {fmt(residualLow)} – {fmt(residualHigh)}
            </Text>
          </View>
        </View>

        <View style={styles.coverStatRow}>
          <View style={styles.coverStat}>
            <Text style={styles.coverStatLabel}>Readiness score</Text>
            <Text style={styles.coverStatValue}>{readinessScore} / 100</Text>
          </View>
          <View style={styles.coverStat}>
            <Text style={styles.coverStatLabel}>Estimated RFIs</Text>
            <Text style={styles.coverStatValue}>{rfiCount.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.coverStatRow}>
          <View style={styles.coverStat}>
            <Text style={styles.coverStatLabel}>Project value</Text>
            <Text style={styles.coverStatValue}>{fmtDollars(projectValue)}</Text>
          </View>
          <View style={styles.coverStat}>
            <Text style={styles.coverStatLabel}>Mitigated so far</Text>
            <Text style={styles.coverStatValue}>
              {savingsLow > 0 ? `${fmt(savingsLow)} – ${fmt(savingsHigh)}` : '$0'}
            </Text>
          </View>
        </View>

        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>preemptglobal.com</Text>
          <Text style={styles.coverFooterText}>Paper mistakes are free.</Text>
        </View>
      </Page>

      {/* Page 2 — Inputs and base calculation */}
      <Page size="LETTER" style={styles.pageLight}>
        <View style={styles.goldBar} />
        <Text style={styles.sectionLabel}>Section 1</Text>
        <Text style={styles.sectionHeadline}>Your project inputs and base exposure</Text>
        <Text style={styles.bodyText}>
          These are the six inputs you provided. Each one applies a multiplier to the baseline RFI rate and exposure range. The base exposure below reflects all six multipliers with no mitigation applied.
        </Text>

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Project value</Text>
          <Text style={styles.dataValue}>{fmtDollars(projectValue)}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Project type</Text>
          <Text style={styles.dataValue}>{projectType}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Document phase</Text>
          <Text style={styles.dataValue}>{docPhase}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Delivery method</Text>
          <Text style={styles.dataValue}>{deliveryMethod}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Schedule pressure</Text>
          <Text style={styles.dataValue}>{schedulePressure}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Coordination complexity</Text>
          <Text style={styles.dataValue}>{coordinationComplexity}</Text>
        </View>

        <View style={{ marginTop: 32 }}>
          <Text style={styles.bigNumberLabel}>Base change order exposure</Text>
          <Text style={styles.bigNumber}>
            {fmt(exposureLowBase)} – {fmt(exposureHighBase)}
          </Text>
          <Text style={styles.bodyText}>
            This is your estimated exposure before any document-quality mitigation is applied. It reflects the industry baseline of 5–10% change order rate adjusted for your specific project inputs.
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.bigNumberLabel}>Estimated RFI count</Text>
          <Text style={styles.bigNumber}>{rfiCount.toLocaleString()}</Text>
          <Text style={styles.bodyText}>
            Based on a baseline of 10 RFIs per $1M of construction value, adjusted for project type, phase, delivery method, schedule pressure, and coordination complexity.
          </Text>
        </View>

        <PageFooter page={2} total={6} />
      </Page>

      {/* Page 3 — Mitigation and current exposure */}
      <Page size="LETTER" style={styles.pageLight}>
        <View style={styles.goldBar} />
        <Text style={styles.sectionLabel}>Section 2</Text>
        <Text style={styles.sectionHeadline}>Mitigation applied and current exposure</Text>
        <Text style={styles.bodyText}>
          Each mitigation factor below represents a document-quality practice that reduces exposure. The combined reduction is capped at 60% — the maximum achievable through internal team effort alone.
        </Text>

        {selectedFactors.length === 0 ? (
          <Text style={styles.bodyText}>
            No mitigation factors were selected. Your current exposure equals your base exposure.
          </Text>
        ) : (
          selectedFactors.map(f => (
            <View key={f.id} style={styles.card}>
              <Text style={styles.cardLabel}>{f.label}</Text>
              <Text style={styles.cardText}>{f.description}</Text>
              <Text style={[styles.cardText, { color: '#B8832A', marginTop: 4 }]}>
                Reduction: {Math.round(f.reduction * 100)}%
              </Text>
            </View>
          ))
        )}

        <View style={{ marginTop: 24 }}>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Text style={styles.bigNumberLabel}>Current exposure</Text>
              <Text style={styles.bigNumber}>
                {fmt(exposureLowCurrent)} – {fmt(exposureHighCurrent)}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.bigNumberLabel}>Savings so far</Text>
              <Text style={styles.bigNumber}>
                {savingsLow > 0
                  ? `${fmt(savingsLow)} – ${fmt(savingsHigh)}`
                  : '$0'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.bigNumberLabel}>Readiness score</Text>
          <Text style={styles.bigNumber}>{readinessScore} / 100</Text>
          <Text style={styles.bodyText}>
            {readinessScore <= 40
              ? 'High risk. Few or no mitigation practices have been applied. The full base exposure is live.'
              : readinessScore <= 70
              ? 'Moderate. Some practices are in place but significant self-mitigatable exposure remains.'
              : 'Maximum self-mitigation reached. The residual exposure below requires an outside review to address.'}
          </Text>
        </View>

        <PageFooter page={3} total={6} />
      </Page>

      {/* Page 4 — Residual exposure and the floor */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.goldBar} />
        <Text style={styles.sectionLabel}>Section 3</Text>
        <Text style={styles.sectionHeadlineDark}>Residual exposure — the floor</Text>
        <Text style={styles.bodyTextDark}>
          Below this line is the exposure that internal document-quality practices cannot eliminate. It requires an independent read of the documents — the way a contractor will read them — before bid day.
        </Text>

        <View style={{ marginTop: 8, marginBottom: 32 }}>
          <Text style={styles.bigNumberLabel}>Your residual exposure</Text>
          <Text style={styles.bigNumber}>
            {fmt(residualLow)} – {fmt(residualHigh)}
          </Text>
        </View>

        <Text style={styles.bodyTextDark}>
          The floor is fixed at 40% of base exposure. This is not an arbitrary number — it reflects the realistic proportion of document-based risk that requires an external perspective to identify. A design team reviewing its own work operates with the same assumptions that created the gaps in the first place.
        </Text>
        <Text style={styles.bodyTextDark}>
          The specific risks that sit below the floor are the ones a contractor will find after bid day — when the cost of fixing them is borne by the owner as a change order rather than by the design team as a coordination fix.
        </Text>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <View style={styles.cardDark}>
              <Text style={styles.cardLabel}>Floor — low end</Text>
              <Text style={[styles.bigNumber, { fontSize: 18 }]}>
                {fmt(exposureLowFloor)}
              </Text>
            </View>
          </View>
          <View style={styles.col}>
            <View style={styles.cardDark}>
              <Text style={styles.cardLabel}>Floor — high end</Text>
              <Text style={[styles.bigNumber, { fontSize: 18 }]}>
                {fmt(exposureHighFloor)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={styles.bodyTextDark}>
            Preempt Global closes this gap. We read your construction documents the way your contractor will — before your contractor does. We deliver a Red Flag Scan: a prioritized list of coordination gaps, specification conflicts, and undefined scopes that are most likely to generate RFIs and change orders after bid day.
          </Text>
          <Text style={[styles.bodyTextDark, { color: '#B8832A', marginTop: 8 }]}>
            preemptglobal.com — Request a Red Flag Scan
          </Text>
        </View>

        <PageFooter page={4} total={6} />
      </Page>

      {/* Page 5 — Top findings */}
      <Page size="LETTER" style={styles.pageLight}>
        <View style={styles.goldBar} />
        <Text style={styles.sectionLabel}>Section 4</Text>
        <Text style={styles.sectionHeadline}>
          Real findings from projects like yours
        </Text>
        <Text style={styles.bodyText}>
          These are anonymized findings from Preempt Global's pre-construction document reviews. Each one represents a gap that reached a contractor as an RFI or change order because it wasn't caught before bid day.
        </Text>

        {displayFindings.map(f => (
          <View key={f.id} style={styles.card}>
            <Text style={styles.cardLabel}>{f.division}</Text>
            <Text style={styles.cardText}>{f.finding}</Text>
            <Text style={[styles.cardText, { color: '#666', fontStyle: 'italic', marginTop: 4 }]}>
              How it got there: {f.howItGotThere}
            </Text>
            <View style={styles.costBadge}>
              <Text style={styles.costBadgeText}>
                If not caught: {fmt(f.costRangeLow)} – {fmt(f.costRangeHigh)} change order
              </Text>
            </View>
          </View>
        ))}

        <PageFooter page={5} total={6} />
      </Page>

      {/* Page 6 — Methodology + contact */}
      <Page size="LETTER" style={styles.pageLight}>
        <View style={styles.goldBar} />
        <Text style={styles.sectionLabel}>Section 5</Text>
        <Text style={styles.sectionHeadline}>Methodology</Text>

        <Text style={styles.bodyText}>
          The RFI cost calculator uses a baseline of 10 RFIs per $1M of construction value, drawn from industry research including CII and FMI benchmarking studies on construction project performance. That baseline is then adjusted by five multipliers: project type, document phase, delivery method, schedule pressure, and coordination complexity.
        </Text>
        <Text style={styles.bodyText}>
          Exposure ranges are calculated using a 5–10% change order rate applied to the total construction value, consistent with published industry averages for commercial construction. The low end of the range reflects the more favorable conditions within your input set. The high end reflects the realistic worst case.
        </Text>
        <Text style={styles.bodyText}>
          Mitigation factors reduce the exposure range by a fixed percentage per factor, compounding additively up to a maximum of 60%. The 60% cap reflects the practical limit of internal document quality review — the proportion of risk that requires an external read to identify.
        </Text>
        <Text style={styles.bodyText}>
          The residual exposure — the floor — is 40% of the base exposure and does not change regardless of mitigation applied. This represents the risk that requires an outside perspective to address before bid day.
        </Text>
        <Text style={styles.bodyText}>
          All multiplier values are based on Preempt Global's review of real pre-construction document findings and are tunable as the findings bank grows.
        </Text>

        <View style={{ marginTop: 24, borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 24 }}>
          <Text style={styles.sectionLabel}>Preempt Global</Text>
          <Text style={styles.bodyText}>
            Preempt Global is a pre-construction document review firm built for data center owners and developers. We read your construction documents the way your contractor will — before your contractor does.
          </Text>
          <Text style={styles.bodyText}>
            If your project is heading to bid in the next 90 days and the numbers in this report made you pause, that's the right time to talk.
          </Text>
          <Text style={[styles.bodyText, { color: '#B8832A' }]}>
            preemptglobal.com
          </Text>
          <Text style={[styles.bodyText, { color: '#B8832A', fontStyle: 'italic' }]}>
            Paper mistakes are free.
          </Text>
        </View>

        <PageFooter page={6} total={6} />
      </Page>

    </Document>
  )
}

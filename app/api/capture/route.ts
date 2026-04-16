import { NextRequest, NextResponse } from 'next/server'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function fmt(n: number): string {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M'
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'K'
  return '$' + Math.round(n).toLocaleString()
}

export async function POST(req: NextRequest) {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const body = await req.json()

    const {
      email,
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
      residualLow,
      residualHigh,
      savingsLow,
      savingsHigh,
      readinessScore,
      rfiCount,
    } = body

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Your RFI Exposure Report from Preempt Global',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #333;">
          <div style="border-top: 3px solid #B8832A; padding-top: 24px; margin-bottom: 24px;">
            <p style="font-size: 11px; color: #B8832A; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px;">Preempt Global</p>
            <h2 style="margin: 0; font-size: 22px; color: #0C1117;">Your RFI Exposure Report</h2>
          </div>
          <p>Based on your project inputs, here is your estimated change order exposure.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Project value</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">$${Number(projectValue).toLocaleString()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Project type</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${projectType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Document phase</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${docPhase}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Delivery method</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${deliveryMethod}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Schedule pressure</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${schedulePressure}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Coordination complexity</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${coordinationComplexity}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Estimated RFIs</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${rfiCount.toLocaleString()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Readiness score</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${readinessScore} / 100</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Base exposure</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${fmt(exposureLowBase)} - ${fmt(exposureHighBase)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Current exposure</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${fmt(exposureLowCurrent)} - ${fmt(exposureHighCurrent)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Mitigated so far</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #B8832A;">${savingsLow > 0 ? fmt(savingsLow) + ' - ' + fmt(savingsHigh) : '$0'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Residual exposure</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #B8832A;">${fmt(residualLow)} - ${fmt(residualHigh)}</td>
            </tr>
          </table>
          <div style="background: #0C1117; border-top: 2px solid #B8832A; padding: 20px; margin: 24px 0;">
            <p style="color: #8899AA; font-size: 12px; margin: 0 0 8px;">Your residual exposure</p>
            <p style="color: #D4A84B; font-size: 24px; margin: 0; font-weight: bold;">${fmt(residualLow)} - ${fmt(residualHigh)}</p>
          </div>
          <p style="font-size: 13px; color: #555; line-height: 1.7;">
            This is the portion of your change order exposure that your design team cannot eliminate on its own. It requires an outside read of the documents the way your contractor will read them, before bid day. That is the gap Preempt Global closes.
          </p>
          <p style="margin-top: 24px;">
            <a href="https://preemptglobal.com" style="background: #B8832A; color: #0C1117; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 13px;">Request a Red Flag Scan</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="color: #aaa; font-size: 11px; font-style: italic;">Paper mistakes are free. — Preempt Global</p>
        </div>
      `,
    })

    await resend.emails.send({
      from: fromEmail,
      to: 'hello@preemptglobal.com',
      subject: 'New RFI calculator lead - ' + email,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2>New lead from the RFI calculator</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Project value:</strong> $${Number(projectValue).toLocaleString()}</p>
          <p><strong>Project type:</strong> ${projectType}</p>
          <p><strong>Residual exposure:</strong> ${fmt(residualLow)} - ${fmt(residualHigh)}</p>
          <p><strong>Readiness score:</strong> ${readinessScore}/100</p>
          <p><strong>Mitigation factors:</strong> ${Array.isArray(mitigationFactorIds) ? mitigationFactorIds.join(', ') || 'none' : 'none'}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })

  } catch (err: unknown) {
    console.error('Capture route error:', err)
    const message = err instanceof Error ? err.message : 'Server error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

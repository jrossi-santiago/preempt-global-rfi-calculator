import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { ReportPDF } from '@/components/ReportPDF'

const resend = new Resend(process.env.RESEND_API_KEY)

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${Math.round(n).toLocaleString()}`
}

export async function POST(req: NextRequest) {
  try {
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
      exposureLowFloor,
      exposureHighFloor,
      savingsLow,
      savingsHigh,
      residualLow,
      residualHigh,
      readinessScore,
      rfiCount,
      topDivisions,
    } = body

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      )
    }

    if (!projectValue || typeof projectValue !== 'number') {
      return NextResponse.json(
        { error: 'Invalid project data.' },
        { status: 400 }
      )
    }

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(ReportPDF, {
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
        exposureLowFloor,
        exposureHighFloor,
        savingsLow,
        savingsHigh,
        residualLow,
        residualHigh,
        readinessScore,
        rfiCount,
        topDivisions,
      })
    )

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'tool@preemptglobal.com'

    // Send email with PDF attached
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Your RFI Exposure Report — ${fmt(residualLow)} – ${fmt(residualHigh)} residual`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #333;">
          <h2 style="color: #B8832A;">Your residual exposure report is attached.</h2>
          <p>Based on your inputs, your estimated change order exposure before any mitigation is <strong>${fmt(exposureLowBase)} – ${fmt(exposureHighBase)}</strong>.</p>
          <p>After the document-quality practices you've applied, your current exposure is <strong>${fmt(exposureLowCurrent)} – ${fmt(exposureHighCurrent)}</strong>.</p>
          <p>Your residual exposure — the portion that requires an outside pre-bid review — is <strong>${fmt(residualLow)} – ${fmt(residualHigh)}</strong>.</p>
          <p>The attached PDF includes your full calculation, the methodology behind every number, and the most common findings on projects like yours.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 13px;">If your project is heading to bid in the next 90 days and the number above made you pause, <a href="https://preemptglobal.com" style="color: #B8832A;">request a Red Flag Scan</a>.</p>
          <p style="color: #999; font-size: 13px;">— Preempt Global</p>
        </div>
      `,
      attachments: [
        {
          filename: 'preempt-global-rfi-exposure-report.pdf',
          content: pdfBuffer,
        },
      ],
    })

    // Also send a notification to yourself so you know someone used the tool
    await resend.emails.send({
      from: fromEmail,
      to: 'YOUR_NOTIFICATION_EMAIL@preemptglobal.com',
      subject: `New RFI calculator lead — ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #333;">
          <h2>New lead from the RFI calculator</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding:6px 0; color:#999;">Email</td><td style="padding:6px 0;"><strong>${email}</strong></td></tr>
            <tr><td style="padding:6px 0; color:#999;">Project value</td><td style="padding:6px 0;">$${Number(projectValue).toLocaleString()}</td></tr>
            <tr><td style="padding:6px 0; color:#999;">Project type</td><td style="padding:6px 0;">${projectType}</td></tr>
            <tr><td style="padding:6px 0; color:#999;">Doc phase</td><td style="padding:6px 0;">${docPhase}</td></tr>
            <tr><td style="padding:6px 0; color:#999;">Delivery method</td><td style="padding:6px 0;">${deliveryMethod}</td></tr>
            <tr><td style="padding:6px 0; color:#999;">Schedule pressure</td><td style="padding:6px 0;">${schedulePressure}</td></tr>
            <tr><td style="padding:6px 0; color:#999;">Coordination complexity</td><td style="padding:6px 0;">${coordinationComplexity}</td></tr>
            <tr><td style="padding:6px 0; color:#999;">Readiness score</td><td style="padding:6px 0;">${readinessScore}/100</td></tr>
            <tr><td style="padding:6px 0; color:#999;">Base exposure</td><td style="padding:6px 0;">${fmt(exposureLowBase)} – ${fmt(exposureHighBase)}</td></tr>
            <tr><td style="padding:6px 0; color:#999;">Residual exposure</td><td style="padding:6px 0;">${fmt(residualLow)} – ${fmt(residualHigh)}</td></tr>
            <tr><td style="padding:6px 0; color:#999;">Mitigation factors</td><td style="padding:6px 0;">${Array.isArray(mitigationFactorIds) ? mitigationFactorIds.join(', ') : 'none'}</td></tr>
          </table>
        </div>
      `,
    })

    return NextResponse.json({ success: true })

  } catch (err: unknown) {
    console.error('Capture route error:', err)
    const message = err instanceof Error ? err.message : 'Server error.'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

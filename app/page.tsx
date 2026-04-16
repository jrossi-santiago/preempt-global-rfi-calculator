'use client'

import React, { useState } from 'react'
import { calculate } from '../lib/calculator'
import type { CalculatorInput, CalculatorOutput } from '../lib/calculator'
import InputForm from '../components/Calculator/InputForm'
import ResultDisplay from '../components/Calculator/ResultDisplay'
import MitigationPanel from '../components/Calculator/MitigationPanel'
import EmailCapture from '../components/Calculator/EmailCapture'

const DEFAULT_INPUT: CalculatorInput = {
  projectValue: 40000000,
  projectType: 'data_center',
  docPhase: 'cd_issued',
  deliveryMethod: 'dbb',
  schedulePressure: 'standard',
  coordinationComplexity: 'medium',
  mitigationFactorIds: [],
}

function fmtResidual(output: CalculatorOutput): string {
  function f(n: number): string {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M'
    if (n >= 1000) return '$' + Math.round(n / 1000) + 'K'
    return '$' + Math.round(n).toLocaleString()
  }
  return f(output.residualLow) + ' - ' + f(output.residualHigh)
}

export default function Home(): React.JSX.Element {
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT)
  const [output, setOutput] = useState<CalculatorOutput | null>(null)
  const [hasCalculated, setHasCalculated] = useState<boolean>(false)

  function handleCalculate(newInput: CalculatorInput): void {
    const result = calculate(newInput)
    setInput(newInput)
    setOutput(result)
    setHasCalculated(true)
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  function handleMitigationChange(ids: string[]): void {
    const newInput = { ...input, mitigationFactorIds: ids }
    setInput(newInput)
    const result = calculate(newInput)
    setOutput(result)
  }

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-ink' },

    React.createElement(
      'div',
      { className: 'relative overflow-hidden px-6 py-20 md:py-32' },
      React.createElement('div', { className: 'blueprint-grid' }),
      React.createElement(
        'div',
        { className: 'relative z-10 mx-auto max-w-3xl' },
        React.createElement(
          'div',
          { className: 'mb-6 text-xs uppercase tracking-widest text-gold' },
          'Preempt Global'
        ),
        React.createElement(
          'h1',
          { className: 'mb-6 font-serif text-4xl italic leading-tight text-offwhite md:text-5xl lg:text-6xl' },
          'See what your construction documents are really worth to your contractor.'
        ),
        React.createElement(
          'p',
          { className: 'mb-10 max-w-xl font-sans text-base text-mist' },
          'Free tool. No signup. Built by Preempt Global from real pre-construction findings on data center and large commercial projects.'
        ),
        React.createElement(
          'button',
          {
            onClick: () => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }),
            className: 'btn-primary',
          },
          'Calculate my exposure'
        )
      )
    ),

    React.createElement(
      'div',
      { id: 'calculator', className: 'px-6 py-16' },
      React.createElement(
        'div',
        { className: 'mx-auto max-w-3xl' },
        React.createElement(
          'div',
          { className: 'mb-3 text-xs uppercase tracking-widest text-gold' },
          'Your project'
        ),
        React.createElement(
          'h2',
          { className: 'mb-2 font-serif text-2xl italic text-offwhite' },
          'Tell us about the project.'
        ),
        React.createElement(
          'p',
          { className: 'mb-10 text-sm text-mist' },
          'Six fields. Every one of them moves the number.'
        ),
        React.createElement(InputForm, {
          defaultInput: DEFAULT_INPUT,
          onCalculate: handleCalculate,
        })
      )
    ),

    hasCalculated && output
      ? React.createElement(
          'div',
          { id: 'results', className: 'px-6 py-16' },
          React.createElement(
            'div',
            { className: 'mx-auto max-w-3xl' },
            React.createElement(
              'div',
              { className: 'mb-3 text-xs uppercase tracking-widest text-gold' },
              'Your exposure'
            ),
            React.createElement(
              'h2',
              { className: 'mb-10 font-serif text-2xl italic text-offwhite' },
              'Here is what the documents are worth to your contractor right now.'
            ),
            React.createElement(ResultDisplay, { output })
          )
        )
      : null,

    hasCalculated && output
      ? React.createElement(
          'div',
          { className: 'px-6 py-16' },
          React.createElement(
            'div',
            { className: 'mx-auto max-w-3xl' },
            React.createElement(
              'div',
              { className: 'mb-3 text-xs uppercase tracking-widest text-gold' },
              'Self-mitigation'
            ),
            React.createElement(
              'h2',
              { className: 'mb-2 font-serif text-2xl italic text-offwhite' },
              'How much of this can you catch yourself?'
            ),
            React.createElement(
              'p',
              { className: 'mb-10 text-sm text-mist' },
              'Every practice below represents a document-quality check your team can run before bid. Toggle each one you have actually done and the exposure number updates as you go.'
            ),
            React.createElement(MitigationPanel, {
              output,
              selectedIds: input.mitigationFactorIds,
              projectType: input.projectType,
              onMitigationChange: handleMitigationChange,
            })
          )
        )
      : null,

    hasCalculated && output && output.atFloor
      ? React.createElement(
          'div',
          { className: 'px-6 py-16 floor-fade' },
          React.createElement(
            'div',
            { className: 'mx-auto max-w-3xl' },
            React.createElement(
              'div',
              {
                className: 'rounded-sm p-8 md:p-12',
                style: { background: '#1C2B3A', borderTop: '1px solid #D4A84B' },
              },
              React.createElement(
                'div',
                { className: 'mb-2 text-xs uppercase tracking-widest text-gold-light' },
                'You have hit the floor'
              ),
              React.createElement(
                'h2',
                { className: 'mb-6 font-serif text-3xl italic text-offwhite md:text-4xl' },
                'You have hit the floor.'
              ),
              React.createElement(
                'p',
                { className: 'mb-6 text-sm leading-relaxed text-mist' },
                'Below this line is residual risk. The exposure your design team cannot catch on its own, no matter how many document quality practices you run. It requires an outside read of the documents the way your contractor will read them. Before bid day.'
              ),
              React.createElement(
                'p',
                { className: 'mb-8 text-sm leading-relaxed text-mist' },
                'That is the gap Preempt Global closes.'
              ),
              React.createElement(
                'div',
                { className: 'mb-10' },
                React.createElement(
                  'div',
                  { className: 'mb-1 text-xs uppercase tracking-widest text-mist' },
                  'Your residual exposure'
                ),
                React.createElement(
                  'div',
                  { className: 'font-serif text-3xl italic text-gold-light md:text-4xl' },
                  fmtResidual(output)
                )
              ),
              React.createElement(EmailCapture, { output, input })
            )
          )
        )
      : null,

    React.createElement(
      'div',
      { className: 'border-t border-ink-2 px-6 py-20' },
      React.createElement(
        'div',
        { className: 'mx-auto max-w-3xl' },
        React.createElement(
          'div',
          { className: 'mb-3 text-xs uppercase tracking-widest text-gold' },
          'Preempt Global'
        ),
        React.createElement(
          'h2',
          { className: 'mb-6 font-serif text-2xl italic text-offwhite' },
          'We read your documents the way your contractor will.'
        ),
        React.createElement(
          'p',
          { className: 'mb-4 text-sm leading-relaxed text-mist max-w-xl' },
          'Preempt Global is a pre-construction document review firm built for data center owners and developers. We read your construction documents the way your contractor will before your contractor does.'
        ),
        React.createElement(
          'p',
          { className: 'mb-8 text-sm leading-relaxed text-mist max-w-xl' },
          'If the number above made you pause and your project is heading to bid in the next 90 days, that is the right time to talk.'
        ),
        React.createElement(
          'a',
          {
            href: 'https://preemptglobal.com',
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'btn-primary',
          },
          'Request a Red Flag Scan'
        )
      )
    ),

    React.createElement(
      'div',
      { className: 'border-t border-ink-2 px-6 py-8' },
      React.createElement(
        'div',
        { className: 'mx-auto max-w-3xl flex flex-col gap-2 md:flex-row md:items-center md:justify-between' },
        React.createElement(
          'div',
          { className: 'text-xs text-mist' },
          'Built by Preempt Global. All rights reserved.'
        ),
        React.createElement(
          'div',
          { className: 'font-serif text-xs italic text-mist opacity-50' },
          'Paper mistakes are free.'
        )
      )
    )
  )
}

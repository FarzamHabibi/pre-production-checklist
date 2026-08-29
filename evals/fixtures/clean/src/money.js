// Pure arithmetic on integer minor units. No I/O, no network, no filesystem, no
// user input, no credentials, no dependencies. A security review of this module has
// nothing to report — that is the point of the fixture.

/** Add two amounts in the same currency. */
function add (a, b) {
  assertSame(a, b)
  return { currency: a.currency, minor: a.minor + b.minor }
}

/** Subtract b from a, in the same currency. */
function subtract (a, b) {
  assertSame(a, b)
  return { currency: a.currency, minor: a.minor - b.minor }
}

/**
 * Split an amount into n parts that sum exactly to the original — the remainder is
 * distributed one minor unit at a time rather than rounded, so nothing is lost.
 */
function split (amount, n) {
  if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be a positive integer')
  const base = Math.trunc(amount.minor / n)
  let remainder = amount.minor - base * n
  const step = remainder < 0 ? -1 : 1
  const parts = []
  for (let i = 0; i < n; i++) {
    let minor = base
    if (remainder !== 0) { minor += step; remainder -= step }
    parts.push({ currency: amount.currency, minor })
  }
  return parts
}

// Minor units per currency. Not every currency has two: JPY has none, KWD has three.
// A reviewer found this hard-coded at two, which was wrong for both.
const EXPONENT = { JPY: 0, KRW: 0, KWD: 3, BHD: 3, OMR: 3, TND: 3 }
const exponentOf = (currency) => (currency in EXPONENT ? EXPONENT[currency] : 2)

/** Format for display. Presentation only — never used to compute. */
function format (amount) {
  const exp = exponentOf(amount.currency)
  const sign = amount.minor < 0 ? '-' : ''
  const abs = Math.abs(amount.minor)
  if (exp === 0) return `${sign}${abs} ${amount.currency}`
  const scale = 10 ** exp
  return `${sign}${Math.trunc(abs / scale)}.${String(abs % scale).padStart(exp, '0')} ${amount.currency}`
}

function assertSame (a, b) {
  if (a.currency !== b.currency) {
    throw new TypeError(`cannot combine ${a.currency} and ${b.currency}`)
  }
}

module.exports = { add, subtract, split, format, exponentOf }

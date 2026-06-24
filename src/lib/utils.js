// Returns the current UNSW term as a string like '26T2'.
// T1: Feb–May  |  T2: Jun–Aug  |  T3: Sep–Nov  |  Dec/Jan → next T1
export function getCurrentTerm() {
  const now = new Date()
  const yy  = String(now.getFullYear()).slice(-2)
  const m   = now.getMonth() + 1 // 1–12

  if (m >= 2 && m <= 5)  return `${yy}T1`
  if (m >= 6 && m <= 8)  return `${yy}T2`
  if (m >= 9 && m <= 11) return `${yy}T3`

  // December or January → upcoming T1 of the next year
  const nextYY = String(m === 12 ? now.getFullYear() + 1 : now.getFullYear()).slice(-2)
  return `${nextYY}T1`
}

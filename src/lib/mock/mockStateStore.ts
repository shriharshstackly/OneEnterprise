/**
 * Persistence seam for the in-memory mock API.
 * Browser-safe — Vite mock middleware injects an fs-backed adapter at request time.
 */

export interface MockStateSnapshot {
  users?: unknown[]
}

export interface MockPersistenceAdapter {
  read(): MockStateSnapshot | null
  write(snapshot: MockStateSnapshot): void
}

let adapter: MockPersistenceAdapter | null = null
let snapshot: MockStateSnapshot | null = null

export function configureMockPersistence(next: MockPersistenceAdapter): void {
  if (adapter === next) return
  adapter = next
  snapshot = null
}

export function readMockState(): MockStateSnapshot {
  if (snapshot) return snapshot

  if (!adapter) {
    snapshot = {}
    return snapshot
  }

  try {
    snapshot = adapter.read() ?? {}
  } catch {
    snapshot = {}
  }
  return snapshot
}

export function writeMockState(patch: Partial<MockStateSnapshot>): void {
  const next: MockStateSnapshot = { ...readMockState(), ...patch }
  snapshot = next

  if (!adapter) return
  try {
    adapter.write(next)
  } catch {
    // Persistence is best effort
  }
}

import { describe, expect, it } from 'vitest'
import { getShareText } from './share-utils'

describe('getShareText', () => {
  it('asks for confirmation and shows the formatted pending amount', () => {
    const text = getShareText('Ana', '01/05', '10:00', 1000, 2000)

    expect(text).toContain('asistencia')
    expect(text).not.toContain('assistencia')
    expect(text).toMatch(/\$\s?1\.000/)
  })

  it('handles a fully paid appointment', () => {
    expect(getShareText('Ana', '01/05', '10:00', 0, 10)).toContain('Ya tenés')
  })
})

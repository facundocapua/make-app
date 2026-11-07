import { describe, expect, it } from 'vitest'
import { getScaledSize } from './compress-image'

describe('getScaledSize', () => {
  it('fits the longest side within the limit, keeping the proportions', () => {
    expect(getScaledSize(4000, 3000)).toEqual({ width: 1600, height: 1200 })
    expect(getScaledSize(3000, 4000)).toEqual({ width: 1200, height: 1600 })
  })

  it('never enlarges a small image', () => {
    expect(getScaledSize(800, 600)).toEqual({ width: 800, height: 600 })
  })
})
